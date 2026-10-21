#!/usr/bin/env python3
"""Adversarial suite: proves every validator rule REJECTS a bad PageSpec and that
every real template / route / example produces ZERO errors.

Controls are synthesized generically from templates/templates.json +
templates/routes.json + the section contracts, so a new template or route is
covered with no new control code. Every template/route is synthesized TWICE:
mode "reference" and mode "generated" (the latter binds every brand/art surface to a
generation-safe role), so a new section that forgot its generatedMode contract fails here.

Usage: python3 schema/tests/adversarial_test.py
Exit 0 = every mutation rejected with the expected rule AND every control passes.
"""
import copy
import json
import os
import re
import sys

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, os.path.join(REPO, "extraction"))
import semantic_validate as SV  # noqa: E402
import verify_all as VA  # noqa: E402  (registry-level checks are exercised below)

CTX = SV.load_context(REPO)


# ------------------------------------------------------------------ synthesis
def synth_value(schema):
    schema = SV._resolve(schema, CTX["schema"])
    if "const" in schema:
        return schema["const"]
    if "enum" in schema:
        return schema["enum"][0]
    if "x-example" in schema:
        return schema["x-example"]
    t = schema.get("type")
    if t == "string":
        return "Lorem"
    if t == "integer":
        return schema.get("minimum", 1)
    if t == "array":
        return [synth_value(schema["items"]) for _ in range(max(1, schema.get("minItems", 1)))]
    if t == "object":
        return {k: synth_value(v) for k, v in schema.get("properties", {}).items() if k in schema.get("required", [])}
    return None


def motion_for(sec, variant):
    m = sec["motion"]
    reg = CTX["motion"]["patterns"]
    entries = []
    for p in list(m["requiredPatterns"]) + list(m["variantRequiredPatterns"].get(variant, [])):
        if p in [e["pattern"] for e in entries]:
            continue
        e = {"pattern": p}
        for k in SV.PIN_KEYS:
            if k in reg[p]:
                e[k] = reg[p][k]
        entries.append(e)
    return {"entries": entries, "reducedMotionFallback": m["reducedMotionFallback"]}


SAFE_REF = {"placeholder-only": "placeholder:x", "user-supplied-only": "data:user-brand#x", "may-generate-synthetic": "generated:x"}


def media_for(sec, mode="reference"):
    out = []
    forced = set(sec.get("generatedMode", {}).get("requiredSlots", [])) if mode == "generated" else set()
    for name, slot in sec["media"]["slots"].items():
        if not slot.get("required") and name not in forced:
            continue
        if mode == "generated":  # first generation-safe role of the slot, with a ref its policy allows
            role_id = next(r for r in slot["roles"] if CTX["roles"][r]["availability"] == "generation-safe")
            ref = SAFE_REF[CTX["roles"][role_id]["policy"]]
        else:
            role_id = slot["roles"][0]
            role = CTX["roles"][role_id]
            ref = {"placeholder-only": "placeholder:x", "data-bound-only": "data:x#y"}.get(role["policy"]) or (role["paths"][0] if role.get("paths") else "generated:x")
        out.append({"slot": name, "assetRole": role_id, "ref": ref})
    return out


def _set_path(value, path, new):
    """Overwrite every value at a dotted path ('cards[].art') with `new`."""
    toks = path.split(".")
    cur = [value]
    for tok in toks[:-1]:
        arr = tok.endswith("[]")
        key = tok[:-2] if arr else tok
        cur = [y for v in cur if isinstance(v, dict) and key in v for y in (v[key] if arr else [v[key]])]
    for v in cur:
        if isinstance(v, dict) and toks[-1] in v:
            v[toks[-1]] = new


def pick_variant(slot, route):
    v = slot["variants"]
    pref = []
    if route.startswith("/mcp"):
        pref = ["mcp-connect", "mcp", "tools", "triggers"]
    if route.startswith("/blog/page/"):
        pref = ["index-page"]
    elif route.startswith("/blog/category/"):
        pref = ["category"]
    elif route.startswith("/blog/author/"):
        pref = ["author"]
    elif route.startswith("/terms"):
        pref = ["terms"]
    elif route.startswith("/privacy"):
        pref = ["privacy"]
    for p in pref:
        if p in v:
            return p
    return v[0]


def synthesize(template_id, route, mode="reference"):
    t = CTX["templates"][template_id]
    r, params = SV.match_route(CTX, template_id, route)
    nodes = []
    hidden = bool(SV.HIDDEN_FLOATING.match(route))
    for i, slot in enumerate(t["nodes"]):
        sid = slot["section"]
        if sid == "shell.floating-card" and hidden:
            continue
        if sid == "catalog.related-grid" and route.startswith("/mcp") and slot["variants"] == ["pairings"]:
            continue
        sec = CTX["sections"][sid]
        variant = pick_variant(slot, route)
        if sid == "catalog.capability-list" and route.startswith("/mcp"):
            variant = "tools" if "tools" in slot["variants"] else "triggers"
        content = synth_value({"$ref": "#/definitions/content." + sid})
        rules = sec.get("variantRules", {}).get(variant, {})
        props = sec["content"]["properties"]
        for f in rules.get("requiredContent", []) + rules.get("requiredAnyContent", [])[:1]:
            content.setdefault(f, synth_value(props[f]))
        for f in rules.get("forbiddenContent", []):
            content.pop(f, None)
        for f, val in rules.get("contentEquals", {}).items():
            content[f] = val
        for f, val in rules.get("minValue", {}).items():
            content[f] = val
        for f, cnt in rules.get("itemCount", {}).items():
            content[f] = [synth_value(props[f]["items"]) for _ in range(cnt)]
        if "kind" in content and "kind" not in rules.get("contentEquals", {}):
            content["kind"] = "mcp" if route.startswith("/mcp") else "pieces"
        if sid == "bento.grid":
            for c in content["cards"]:
                c["span"] = 12
        if sid == "shell.header":
            variant = "on-art" if route == "/" else "default"
        node = {"id": "n%d" % i, "section": sid, "variant": variant, "content": content, "motion": motion_for(sec, variant)}
        if mode == "generated":
            for path in sec.get("generatedMode", {}).get("forbiddenContentValues", {}):
                _set_path(content, path, "generic")
        med = media_for(sec, mode)
        if med:
            node["media"] = med
        nodes.append(node)
    spec = {"pageSpecVersion": CTX["schema"]["properties"]["pageSpecVersion"]["const"], "mode": mode, "template": template_id, "route": route, "meta": {"title": "Synthetic control"}, "nodes": nodes}
    bind_route(spec, params or {})
    return spec


def bind_route(spec, params):
    t = spec["template"]
    for n in spec["nodes"]:
        c = n["content"]
        if t == "template.catalog-detail" and "subject" in c:
            c["subject"] = "data:pieces#" + params["slug"]
        if t == "template.catalog-pair" and "subject" in c:
            a, b = params["a"], params["b"]
            if n["variant"] == "pair-target":
                c["subject"], c["exclude"] = "data:pieces#" + b, "data:pieces#" + a
            elif n["variant"] == "pair-source":
                c["subject"], c["exclude"] = "data:pieces#" + a, "data:pieces#" + b
            else:
                c["subject"], c["subjectB"] = "data:pieces#" + a, "data:pieces#" + b
        if n["section"] == "content.legal":
            c["doc"] = spec["route"].strip("/")
            n["variant"] = c["doc"]
        if n["section"] == "content.blog-listing" and n["variant"] == "index-page":
            c["page"] = int(params.get("n", 2))


def load_ex(name):
    with open(os.path.join(REPO, "schema", name), encoding="utf-8") as f:
        return json.load(f)


def node_of(spec, section, nth=0):
    hits = [n for n in spec["nodes"] if n["section"] == section]
    return hits[nth]


# ------------------------------------------------------------------ mutations
EX = load_ex("example.pagespec.json")
EX2 = load_ex("example.catalog-detail.pagespec.json")
GEN = load_ex("example.generated.pagespec.json")


def m(base, fn):
    s = copy.deepcopy(base)
    fn(s)
    return s


def C(t, route=None):
    route = route or next(r["sampleRoute"] for r in CTX["routes"] if r["template"] == t)
    return synthesize(t, route)


MUTATIONS = [
    # schema layer
    ("unknown template enum", m(EX, lambda s: s.update(template="template.blog")), {"SCHEMA", "TEMPLATE_KNOWN"}),
    ("node missing motion", m(EX, lambda s: s["nodes"][1].pop("motion")), {"SCHEMA"}),
    ("missing reducedMotionFallback", m(EX, lambda s: s["nodes"][1]["motion"].pop("reducedMotionFallback")), {"SCHEMA"}),
    ("invented motion field", m(EX, lambda s: s["nodes"][1]["motion"]["entries"][0].update(inventedAnimation="spin")), {"SCHEMA"}),
    ("invented section type", m(EX, lambda s: s["nodes"][2].update(section="hero.fancy")), {"SCHEMA"}),
    ("invented assetRole", m(EX, lambda s: s["nodes"][1]["media"][0].update(assetRole="image")), {"SCHEMA"}),
    ("article body smuggled in", m(C("template.blog-article"), lambda s: node_of(s, "content.article")["content"].update(markdown="# Fabricated body")), {"SCHEMA", "NO_STORED_BODIES"}),
    ("article bodyMode not placeholder", m(C("template.blog-article"), lambda s: node_of(s, "content.article")["content"].update(bodyMode="full")), {"SCHEMA", "NO_STORED_BODIES"}),
    ("external http media ref", m(EX, lambda s: s["nodes"][1]["media"][0].update(ref="https://www.activepieces.com/panel/clouds.webp")), {"SCHEMA", "MEDIA_REF_POLICY"}),
    ("wrong reducedMotionFallback const", m(EX, lambda s: s["nodes"][1]["motion"].update(reducedMotionFallback="not-applicable")), {"SCHEMA", "REDUCED_MOTION_FALLBACK"}),
    ("unknown content field", m(EX, lambda s: s["nodes"][1]["content"].update(subtitle="extra")), {"SCHEMA"}),
    # structural
    ("duplicate shell.header", m(EX, lambda s: s["nodes"].insert(1, copy.deepcopy(s["nodes"][0]))), {"NODE_SEQUENCE_MATCHES_TEMPLATE", "SHELL_HEADER_FIRST"}),
    ("footer removed", m(EX, lambda s: s["nodes"].pop(-2)), {"NODE_SEQUENCE_MATCHES_TEMPLATE", "FOOTER_THEN_FLOATING_LAST"}),
    ("hero moved after bento", m(EX, lambda s: s["nodes"].insert(2, s["nodes"].pop(1))), {"NODE_SEQUENCE_MATCHES_TEMPLATE", "HERO_FOLLOWS_HEADER"}),
    ("solution nodes declared as template.product", m(EX, lambda s: s.update(template="template.product", route="/product/chat")), {"NODE_SEQUENCE_MATCHES_TEMPLATE"}),
    ("floating card on /pricing", m(C("template.pricing"), lambda s: s["nodes"].append({"id": "fc", "section": "shell.floating-card", "variant": "default", "content": {}, "motion": motion_for(CTX["sections"]["shell.floating-card"], "default")})), {"FLOATING_CARD_ROUTE_RULE"}),
    ("floating card on /blog index", m(C("template.blog-listing", "/blog"), lambda s: s["nodes"].append({"id": "fc", "section": "shell.floating-card", "variant": "default", "content": {}, "motion": motion_for(CTX["sections"]["shell.floating-card"], "default")})), {"FLOATING_CARD_ROUTE_RULE"}),
    ("floating card missing on /solutions/*", m(EX, lambda s: s["nodes"].pop()), {"FLOATING_CARD_ROUTE_RULE"}),
    ("floating card missing on /product/*", m(C("template.product"), lambda s: s["nodes"].pop()), {"FLOATING_CARD_ROUTE_RULE"}),
    ("header on-art off the homepage", m(EX, lambda s: s["nodes"][0].update(variant="on-art")), {"HEADER_ON_ART_HOME_ONLY", "NODE_SEQUENCE_MATCHES_TEMPLATE"}),
    ("header on /sales (standalone)", m(C("template.sales"), lambda s: s["nodes"].insert(0, copy.deepcopy(EX["nodes"][0]))), {"SHELL_HEADER_FIRST"}),
    ("variant not allowed in slot", m(EX, lambda s: s["nodes"][2].update(variant="home-platform")), {"NODE_SEQUENCE_MATCHES_TEMPLATE"}),
    ("unknown solution slug", m(EX, lambda s: s.update(route="/solutions/astrology")), {"ROUTE_MATCHES_TEMPLATE"}),
    ("route of another template", m(EX, lambda s: s.update(route="/pricing")), {"ROUTE_MATCHES_TEMPLATE"}),
    ("duplicate node id", m(EX, lambda s: s["nodes"][2].update(id="hero")), {"UNIQUE_NODE_IDS"}),
    # runtime / content
    ("maxWords overflow on hero lede", m(EX, lambda s: s["nodes"][1]["content"].update(lede=" ".join(["word"] * 41))), {"MAX_WORDS"}),
    ("maxWords overflow on faq answer", m(EX, lambda s: node_of(s, "faq.accordion")["content"]["items"][0].update(answer=" ".join(["w"] * 111))), {"MAX_WORDS"}),
    ("real customer named in testimonial", m(EX, lambda s: node_of(s, "proof.testimonials")["content"]["cards"][0].update(quote="Bosch rolled this out in a week.")), {"REAL_ENTITY_DENYLIST"}),
    ("real reviewer name", m(EX, lambda s: node_of(s, "proof.testimonials")["content"]["cards"][0].update(name="Kevin Hu")), {"REAL_ENTITY_DENYLIST"}),
    ("real blog author named", m(EX, lambda s: node_of(s, "proof.case-study")["content"].update(name=CTX["policy"]["realEntityDenylist"]["blogAuthors"][0])), {"REAL_ENTITY_DENYLIST"}),
    ("verbatim real headline", m(EX, lambda s: s["nodes"][1]["content"].update(h1="AI Agents with enterprise control")), {"REAL_COPY_VERBATIM"}),
    ("real quote embedded", m(EX, lambda s: node_of(s, "proof.case-study")["content"].update(quoteTail="Activepieces was instrumental in helping us become an AI-first organization.")), {"REAL_COPY_VERBATIM", "MAX_WORDS"}),
    ("real avatar path on placeholder-only role", m(EX, lambda s: node_of(s, "proof.testimonials")["media"][0].update(ref="/reviews/g2-markd.webp")), {"MEDIA_REF_POLICY"}),
    ("real customer logo path", m(EX, lambda s: s["nodes"][1]["media"][1].update(ref="/logos/customers/bosch.svg")), {"MEDIA_REF_POLICY"}),
    ("art path outside closed set", m(EX, lambda s: s["nodes"][1]["media"][0].update(ref="/panel/sunset.webp")), {"MEDIA_REF_POLICY"}),
    ("role not allowed for slot", m(EX, lambda s: s["nodes"][1]["media"][0].update(assetRole="customer.logo", ref="placeholder:x")), {"MEDIA_ROLE_ALLOWED"}),
    ("slot maxItems exceeded", m(EX, lambda s: s["nodes"][1]["media"].append(copy.deepcopy(s["nodes"][1]["media"][0]))), {"MEDIA_ROLE_ALLOWED"}),
    ("required media slot removed", m(EX, lambda s: node_of(s, "proof.case-study").pop("media")), {"REQUIRED_MEDIA_SLOT"}),
    ("outbound link to unknown host", m(EX2, lambda s: node_of(s, "cta.band")["content"].update(primaryHref="https://example.com/x")), {"SCHEMA", "OUTBOUND_LINK_HOSTS"}),
    # motion
    ("template hero with homepage duration", m(EX, lambda s: s["nodes"][1]["motion"]["entries"][0].update(durationMs=760)), {"MOTION_VALUES_PINNED"}),
    ("pinned easing changed", m(EX, lambda s: s["nodes"][1]["motion"]["entries"][0].update(easing="ease-spring")), {"MOTION_VALUES_PINNED"}),
    ("pattern not allowed for section", m(EX, lambda s: s["nodes"][2]["motion"]["entries"].append({"pattern": "marquee-drift", "trigger": "continuous", "durationMs": 82800, "easing": "linear"})), {"SCHEMA", "MOTION_PATTERN_ALLOWED"}),
    ("required variant motion missing", m(EX, lambda s: s["nodes"][1]["motion"].update(entries=s["nodes"][1]["motion"]["entries"][:1])), {"MOTION_PATTERN_ALLOWED"}),
    # variants / data rules
    ("bento row overflow", m(EX, lambda s: node_of(s, "bento.grid")["content"]["cards"][1].update(span=15)), {"BENTO_ROW_SUM_24"}),
    ("bento wrong card count", m(EX, lambda s: node_of(s, "bento.grid")["content"]["cards"].pop()), {"VARIANT_RULES", "BENTO_ROW_SUM_24"}),
    ("solution hero with columns", m(EX, lambda s: s["nodes"][1]["content"].update(columns=[{"title": "a", "body": "b"}] * 3)), {"VARIANT_RULES"}),
    ("mixed catalog kinds", m(EX2, lambda s: node_of(s, "catalog.about")["content"].update(kind="mcp")), {"CATALOG_KIND_CONSISTENT", "VARIANT_RULES"}),
    ("detail subject != route slug", m(EX2, lambda s: node_of(s, "hero.catalog-detail")["content"].update(subject="data:pieces#gmail")), {"ROUTE_SUBJECT_MATCH"}),
    ("pair with identical slugs", m(C("template.catalog-pair"), lambda s: (s.update(route="/pieces/slack/slack"), bind_route(s, {"a": "slack", "b": "slack"}))), {"ROUTE_SUBJECT_MATCH"}),
    ("legal doc does not match route", m(C("template.legal", "/terms"), lambda s: node_of(s, "content.legal")["content"].update(doc="privacy")), {"ROUTE_SUBJECT_MATCH", "VARIANT_RULES"}),
    ("blog index-first on page 2", m(C("template.blog-listing", "/blog"), lambda s: node_of(s, "content.blog-listing")["content"].update(page=2)), {"VARIANT_RULES"}),
    ("pieces mosaic without its link", m(C("template.home", "/"), lambda s: node_of(s, "feature.demo-split", 2)["content"].pop("link")), {"VARIANT_RULES"}),
    ("pairings row on an /mcp detail page", m(C("template.catalog-detail", "/mcp/slack"), lambda s: s["nodes"].insert(len(s["nodes"]) - 3, {"id": "pairs", "section": "catalog.related-grid", "variant": "pairings", "content": {"kind": "mcp", "subject": "data:pieces#slack"}, "motion": motion_for(CTX["sections"]["catalog.related-grid"], "pairings")})), {"VARIANT_RULES"}),
    ("optional slot skip cannot hide a missing required node", m(C("template.catalog-detail", "/mcp/slack"), lambda s: s["nodes"].pop(-3)), {"NODE_SEQUENCE_MATCHES_TEMPLATE"}),
    ("footer default variant with custom buttons", m(EX, lambda s: node_of(s, "shell.footer-closing")["content"].update(primary={"label": "Go", "href": "/sales"})), {"VARIANT_RULES"}),
]


def _put(spec, section, slot, role, ref, alt="x"):
    node_of(spec, section).setdefault("media", []).append({"slot": slot, "assetRole": role, "ref": ref, "alt": alt})


def _replace_brand(spec, section, slot, role, ref):
    node_of(spec, section)["media"] = [{"slot": slot, "assetRole": role, "ref": ref, "alt": ""}]


def _drop_mode(s):
    s.pop("mode")


WORDMARK = "/brand/activepieces-wordmark.svg"
LOGOMARK = "/brand/activepieces-logomark.svg"

# --- generated mode (brand safety): each is the generation-safe example with ONE leak injected
GEN_MUTATIONS = [
    # mode field
    ("missing mode", m(EX, _drop_mode), {"SCHEMA", "PAGESPEC_MODE"}),
    ("mode 'hybrid' (not in the closed enum)", m(GEN, lambda s: s.update(mode="hybrid")), {"SCHEMA", "PAGESPEC_MODE"}),
    ("mode in the wrong case", m(GEN, lambda s: s.update(mode="Generated")), {"SCHEMA", "PAGESPEC_MODE"}),
    ("mode null", m(GEN, lambda s: s.update(mode=None)), {"SCHEMA", "PAGESPEC_MODE"}),
    ("brandContext invented next to mode", m(GEN, lambda s: s.update(brandContext="other-brand")), {"SCHEMA"}),
    # wordmark leakage
    ("wordmark leakage: brand.wordmark in the header", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.wordmark", WORDMARK)), {"GENERATED_MODE_ASSET_ROLES"}),
    ("wordmark leakage next to the placeholder", m(GEN, lambda s: _put(s, "shell.header", "brand", "brand.wordmark", WORDMARK)), {"GENERATED_MODE_ASSET_ROLES"}),
    ("wordmark leakage: brand.logo-full on the app mock", m(C("template.home", "/"), lambda s: (s.update(mode="generated"), _put(s, "media.app-shot", "sidebarLogo", "brand.logo-full", "/brand/activepieces-logo.svg"))), {"GENERATED_MODE_ASSET_ROLES"}),
    ("wordmark path smuggled through brand.placeholder", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.placeholder", WORDMARK)), {"GENERATED_MODE_SOURCE_ARTWORK", "GENERATED_MODE_BRAND_TERMS", "MEDIA_REF_POLICY"}),
    ("wordmark path smuggled through brand.user-supplied", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.user-supplied", WORDMARK)), {"GENERATED_MODE_SOURCE_ARTWORK", "GENERATED_MODE_BRAND_TERMS", "MEDIA_REF_POLICY"}),
    ("wordmark path smuggled through mock.brand-fictional", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "mock.brand-fictional", WORDMARK)), {"GENERATED_MODE_SOURCE_ARTWORK", "GENERATED_MODE_BRAND_TERMS", "MEDIA_ROLE_ALLOWED"}),
    ("wordmark name smuggled through a placeholder ref", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.placeholder", "placeholder:activepieces-wordmark")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name smuggled through a generated: ref", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.placeholder", "generated:activepieces-wordmark")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name smuggled through alt text", m(GEN, lambda s: node_of(s, "shell.header")["media"][0].update(alt="Activepieces wordmark")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name spelled 'Active Pieces' in copy", m(GEN, lambda s: node_of(s, "shell.footer-closing")["content"].update(h2="Join Active Pieces today.")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name in upper case in copy", m(GEN, lambda s: node_of(s, "shell.footer-closing")["content"].update(lede="ACTIVEPIECES approves every run.")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name in the page title", m(GEN, lambda s: s["meta"].update(title="Activepieces for finance")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name in a node id", m(GEN, lambda s: node_of(s, "shell.header").update(id="activepieces-header")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("wordmark name in a cta href host", m(GEN, lambda s: node_of(s, "shell.footer-closing")["content"].update(primary={"label": "Go", "href": "https://cloud.activepieces.com/sign-up"}, secondary={"label": "Talk", "href": "/sales"})), {"GENERATED_MODE_BRAND_TERMS", "VARIANT_RULES"}),
    # logomark leakage
    ("logomark leakage: brand.logomark in the header", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.logomark", LOGOMARK)), {"GENERATED_MODE_ASSET_ROLES"}),
    ("logomark leakage: brand.mark on the floating card", m(GEN, lambda s: _replace_brand(s, "shell.floating-card", "mark", "brand.mark", "/brand/activepieces-mark.svg")), {"GENERATED_MODE_ASSET_ROLES"}),
    ("logomark leakage: wordmark AND logomark together", m(GEN, lambda s: node_of(s, "shell.header").update(media=[{"slot": "brand", "assetRole": "brand.wordmark", "ref": WORDMARK}, {"slot": "brand", "assetRole": "brand.logomark", "ref": LOGOMARK}])), {"GENERATED_MODE_ASSET_ROLES"}),
    ("logomark path smuggled through brand.placeholder", m(GEN, lambda s: _replace_brand(s, "shell.floating-card", "mark", "brand.placeholder", "/brand/activepieces-mark.svg")), {"GENERATED_MODE_SOURCE_ARTWORK", "MEDIA_REF_POLICY", "GENERATED_MODE_BRAND_TERMS"}),
    ("logomark in the header slot removed (clone would draw its own)", m(GEN, lambda s: node_of(s, "shell.header").pop("media")), {"GENERATED_MODE_REQUIRED_SLOTS"}),
    ("floating-card mark removed (clone would draw its own)", m(GEN, lambda s: node_of(s, "shell.floating-card").pop("media")), {"GENERATED_MODE_REQUIRED_SLOTS"}),
    ("brand.user-supplied bound to a file path", m(GEN, lambda s: _replace_brand(s, "shell.floating-card", "mark", "brand.user-supplied", "/logos/own.svg")), {"GENERATED_MODE_SOURCE_ARTWORK", "MEDIA_REF_POLICY"}),
    ("brand.user-supplied bound to a third-party dataset ref", m(GEN, lambda s: _replace_brand(s, "shell.floating-card", "mark", "brand.user-supplied", "data:pieces#slack")), {"MEDIA_REF_POLICY"}),
    ("brand.placeholder bound to a data ref", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.placeholder", "data:user-brand#logo")), {"MEDIA_REF_POLICY"}),
    # source artwork reuse
    ("source artwork: art.panel stage art", m(GEN, lambda s: _replace_brand(s, "hero.product-stage", "stageArt", "art.panel", "/panel/clouds.webp")), {"GENERATED_MODE_ASSET_ROLES", "GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source artwork: art.closing footer band", m(GEN, lambda s: _replace_brand(s, "shell.footer-closing", "closingArt", "art.closing", "/closing/meadow-1376.webp")), {"GENERATED_MODE_ASSET_ROLES", "GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source artwork: art.plate hero plates", m(C("template.home", "/"), lambda s: (s.update(mode="generated"), _put(s, "hero.home-stage", "plates", "art.plate", "/hero/hero-base-1376.webp"))), {"GENERATED_MODE_ASSET_ROLES", "GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source artwork: art.gov-hero", m(C("template.ai-governance"), lambda s: (s.update(mode="generated"), _put(s, "governance.hero", "heroArt", "art.gov-hero", "/gov-hero/green-1600.webp"))), {"GENERATED_MODE_ASSET_ROLES", "GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source artwork: blog.cover editorial cover", m(C("template.blog-article"), lambda s: (s.update(mode="generated"), _put(s, "content.article", "cover", "blog.cover", "data:blog#some-post"))), {"GENERATED_MODE_ASSET_ROLES"}),
    ("source artwork path smuggled through art.generic", m(GEN, lambda s: _replace_brand(s, "hero.product-stage", "stageArt", "art.generic", "/panel/clouds.webp")), {"GENERATED_MODE_SOURCE_ARTWORK", "MEDIA_REF_POLICY"}),
    ("source artwork path through mock.avatar (policy alone would accept it)", m(C("template.blog-article"), lambda s: (s.update(mode="generated"), _put(s, "content.article", "bots", "mock.avatar", "/avatars/bots/atlas.svg"))), {"GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source artwork path through mock.brand-fictional (the clone's Calder logo)", m(C("template.home", "/"), lambda s: (s.update(mode="generated"), _put(s, "media.app-shot", "agentAvatars", "mock.brand-fictional", "/logos/calder.svg"))), {"GENERATED_MODE_SOURCE_ARTWORK", "MEDIA_ROLE_ALLOWED"}),
    ("source art name in hero content (stageArt: clouds)", m(GEN, lambda s: node_of(s, "hero.product-stage")["content"].update(stageArt="clouds")), {"GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source art name in hero content (stageArt: coast)", m(GEN, lambda s: node_of(s, "hero.product-stage")["content"].update(stageArt="coast")), {"GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source art name on one bento card (art: iris)", m(GEN, lambda s: node_of(s, "bento.grid")["content"]["cards"][3].update(art="iris")), {"GENERATED_MODE_SOURCE_ARTWORK"}),
    ("source art name on every bento card (art: meadow)", m(GEN, lambda s: [c.update(art="meadow") for c in node_of(s, "bento.grid")["content"]["cards"]]), {"GENERATED_MODE_SOURCE_ARTWORK"}),
    ("generic stage art removed (clone would draw its own)", m(GEN, lambda s: node_of(s, "hero.product-stage").pop("media")), {"REQUIRED_MEDIA_SLOT", "GENERATED_MODE_REQUIRED_SLOTS"}),
    ("closing art removed (clone would draw its own meadow)", m(GEN, lambda s: node_of(s, "shell.footer-closing").pop("media")), {"GENERATED_MODE_REQUIRED_SLOTS"}),
    ("investor badge in the footer (badge.backer)", m(GEN, lambda s: _put(s, "shell.footer-closing", "backerBadge", "badge.backer", "/logos/ycombinator.svg")), {"GENERATED_MODE_ASSET_ROLES", "GENERATED_MODE_SOURCE_ARTWORK"}),
    ("third-party dataset logo (piece.logo) in generated mode", m(EX2, lambda s: s.update(mode="generated")), {"GENERATED_MODE_ASSET_ROLES"}),
]

# Rule-level tests: rules whose violation is normally masked by the template sequence check.
HOME = C("template.home", "/")
UNIT = [
    ("ONE_HERO: two heroes", m(EX, lambda s: s["nodes"].insert(2, copy.deepcopy(s["nodes"][1]))), {"ONE_HERO"}),
    ("ONE_HERO: hero on a no-hero template", m(C("template.legal", "/terms"), lambda s: s["nodes"].insert(1, copy.deepcopy(EX["nodes"][1]))), {"ONE_HERO"}),
    ("HOME_ROUTE_ONLY: dream on /pricing", m(C("template.pricing"), lambda s: s["nodes"].insert(1, copy.deepcopy(node_of(HOME, "story.dream-scroll")))), {"HOME_ROUTE_ONLY"}),
    ("NO_CONSECUTIVE_SCROLL_STAGES", m(C("template.ai-governance"), lambda s: s["nodes"].insert(3, copy.deepcopy(node_of(s, "governance.rollout-deck")))), {"NO_CONSECUTIVE_SCROLL_STAGES"}),
    ("ONE_PER_PAGE: two testimonials", m(EX, lambda s: s["nodes"].insert(5, copy.deepcopy(node_of(s, "proof.testimonials")))), {"ONE_PER_PAGE"}),
    ("NO_ADJACENT_SAME_SECTION_VARIANT", m(EX, lambda s: s["nodes"].insert(3, dict(copy.deepcopy(s["nodes"][2]), id="grid2"))), {"NO_ADJACENT_SAME_SECTION_VARIANT"}),
    ("PAGESPEC_MODE: missing", m(GEN, _drop_mode), {"PAGESPEC_MODE"}),
    ("GENERATED_MODE_ASSET_ROLES: wordmark", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.wordmark", WORDMARK)), {"GENERATED_MODE_ASSET_ROLES"}),
    ("GENERATED_MODE_SOURCE_ARTWORK: plate path via art.generic", m(GEN, lambda s: _replace_brand(s, "hero.product-stage", "stageArt", "art.generic", "/panel/clouds.webp")), {"GENERATED_MODE_SOURCE_ARTWORK"}),
    ("GENERATED_MODE_BRAND_TERMS: name in alt", m(GEN, lambda s: node_of(s, "shell.header")["media"][0].update(alt="Activepieces")), {"GENERATED_MODE_BRAND_TERMS"}),
    ("GENERATED_MODE_REQUIRED_SLOTS: header brand missing", m(GEN, lambda s: node_of(s, "shell.header").pop("media")), {"GENERATED_MODE_REQUIRED_SLOTS"}),
    ("MOTION_BUDGET (warn): 7 looping motions", m(HOME, lambda s: node_of(s, "faq.accordion")["motion"]["entries"].extend([{"pattern": "marquee-drift", "trigger": "continuous", "durationMs": 82800, "easing": "linear"}] * 3)), set()),
]


def _real_brand_reference():
    s = copy.deepcopy(EX)
    s["meta"] = {"title": "Reference clone page", "description": "Reference-mode control that keeps the real Activepieces brand for clone fidelity."}
    node_of(s, "shell.header")["media"] = [{"slot": "brand", "assetRole": "brand.wordmark", "ref": WORDMARK, "alt": ""}, {"slot": "brand", "assetRole": "brand.logomark", "ref": LOGOMARK, "alt": ""}]
    node_of(s, "shell.footer-closing")["media"] = [{"slot": "closingArt", "assetRole": "art.closing", "ref": "/closing/meadow-1376.webp", "alt": ""}, {"slot": "backerBadge", "assetRole": "badge.backer", "ref": "/logos/ycombinator.svg", "alt": ""}]
    node_of(s, "shell.floating-card")["media"] = [{"slot": "mark", "assetRole": "brand.mark", "ref": "/brand/activepieces-mark.svg", "alt": ""}]
    return s


REAL_BRAND_REF = _real_brand_reference()


def registry_checks():
    """Tamper with the registry in memory and require verify_all's pure check to reject it. The semantic validator is
    data-driven (it reads `availability`), so a tampered registry would otherwise silently legalise the leak."""
    roles_doc = json.load(open(os.path.join(REPO, "assets", "asset-roles.json"), encoding="utf-8"))
    sections = CTX["sections"]

    def tampered(fn):
        d = copy.deepcopy(roles_doc)
        fn(d["roles"])
        return d

    def flip(rid, av, alts=None):
        def go(roles):
            roles[rid]["availability"] = av
            if alts is not None:
                roles[rid]["generatedModeAlternatives"] = alts
        return go

    def drop(rid):
        return lambda roles: roles[rid].pop("availability")

    cases = [
        ("pinned: brand.wordmark reference-only -> generation-safe", tampered(flip("brand.wordmark", "generation-safe", []))),
        ("pinned: brand.wordmark -> blocked-in-generated (different but VALID, consistent alternatives)", tampered(flip("brand.wordmark", "blocked-in-generated", []))),
        ("pinned: brand.logomark -> blocked-in-generated (different but VALID)", tampered(flip("brand.logomark", "blocked-in-generated", []))),
        ("pinned: art.panel -> generation-safe (source artwork declared safe)", tampered(lambda r: (r["art.panel"].update(availability="generation-safe", generatedModeAlternatives=[]), r["art.panel"].update(policy="may-generate-synthetic")))),
        ("pinned: badge.backer blocked -> reference-only", tampered(flip("badge.backer", "reference-only", ["art.generic"]))),
        ("pinned: testimonial.avatar generation-safe -> reference-only", tampered(flip("testimonial.avatar", "reference-only", ["art.generic"]))),
        ("pinned: brand.placeholder generation-safe -> reference-only", tampered(flip("brand.placeholder", "reference-only", ["brand.user-supplied"]))),
        ("unclassified role (availability removed)", tampered(drop("brand.mark"))),
        ("availability outside the closed enum", tampered(flip("brand.mark", "reference_only"))),
        ("generation-safe role that reuses clone files (reuse-closed-set + paths)", tampered(lambda r: r["mock.avatar"].update(policy="reuse-closed-set"))),
        ("reference-only role without a generation-safe alternative", tampered(flip("art.closing", "reference-only", []))),
        ("reference-only alternative that is itself not generation-safe", tampered(flip("art.closing", "reference-only", ["art.plate"]))),
        ("blocked-in-generated role that claims an alternative", tampered(flip("piece.logo", "blocked-in-generated", ["art.generic"]))),
    ]
    fails = 0
    n = 0
    for name, doc in cases:
        probs = VA.asset_availability_problems(doc, sections)
        ok = bool(probs)
        fails += 0 if ok else 1
        n += 1
        print("  %s  %-86s -> %s" % ("REJECTED" if ok else "ACCEPTED!", name, probs[0][:70] if ok else "no problem reported"))
    # the gap the pinned check closes: with the wordmark flipped to generation-safe the validator alone accepts the leak
    leak = m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.wordmark", WORDMARK))
    ctx2 = dict(CTX, roles=tampered(flip("brand.wordmark", "generation-safe", []))["roles"])
    only_validator = not any(e["rule"] == "GENERATED_MODE_ASSET_ROLES" for e in SV.errors(SV.validate(leak, ctx2)))
    caught = bool(VA.asset_availability_problems(tampered(flip("brand.wordmark", "generation-safe", [])), sections))
    ok = only_validator and caught
    fails += 0 if ok else 1
    n += 1
    print("  %s  %-86s -> validator alone %s; pinned check %s" % ("REJECTED" if ok else "FAIL", "tampered registry would legalise the wordmark leak; pinned check must catch it", "accepts it" if only_validator else "rejects it", "rejects" if caught else "MISSES"))
    # controls
    base = VA.asset_availability_problems(roles_doc, sections)
    fails += 1 if base else 0
    print("  %s  real registry + section contracts have 0 availability problems%s" % ("PASS" if not base else "FAIL", "" if not base else " -> " + "; ".join(base[:3])))
    return fails, n


def run():
    fails = 0
    print("== CONTROLS (expect 0 errors)")
    controls = [("example.pagespec.json", EX), ("example.catalog-detail.pagespec.json", EX2)]
    for tid in sorted(CTX["templates"]):
        r = next(x for x in CTX["routes"] if x["template"] == tid)
        controls.append(("template %s (%s)" % (tid, r["sampleRoute"]), synthesize(tid, r["sampleRoute"])))
    for r in CTX["routes"]:
        controls.append(("route %s -> %s" % (r["pattern"], r["sampleRoute"]), synthesize(r["template"], r["sampleRoute"])))
    for extra in ("/mcp", "/mcp/slack", "/mcp/category/productivity", "/blog/page/5", "/blog/author/example-author", "/terms", "/docs/getting-started", "/pieces/zoom/zuora"):
        tid = next(r["template"] for r in CTX["routes"] if SV._route_regex(r["pattern"])[0].match(extra) and r["pattern"] != "*")
        controls.append(("route %s" % extra, synthesize(tid, extra)))
    controls.append(("example.generated.pagespec.json (mode generated)", GEN))
    controls.append(("reference-mode spec with the real brand (wordmark, logomark, mark, closing art, YC badge, real art names)", REAL_BRAND_REF))
    controls.append(("generated example with the placeholder brand swapped for brand.user-supplied", m(GEN, lambda s: _replace_brand(s, "shell.header", "brand", "brand.user-supplied", "data:user-brand#logo"))))
    controls.append(("generated example's fictional brand name in copy (Quillbright)", m(GEN, lambda s: node_of(s, "shell.footer-closing")["content"].update(h2="Quillbright closes your month."))))
    blocked_t = {tid for tid, t in CTX["templates"].items() if any(CTX["sections"][n["section"]].get("generatedMode", {}).get("blocked") for n in t["nodes"])}
    for tid in sorted(set(CTX["templates"]) - blocked_t):
        r = next(x for x in CTX["routes"] if x["template"] == tid)
        controls.append(("GENERATED template %s (%s)" % (tid, r["sampleRoute"]), synthesize(tid, r["sampleRoute"], "generated")))
    for r in CTX["routes"]:
        if r["template"] not in blocked_t:
            controls.append(("GENERATED route %s -> %s" % (r["pattern"], r["sampleRoute"]), synthesize(r["template"], r["sampleRoute"], "generated")))
    # templates built on a blocked section are reference-only: the same synthesis must be REJECTED in generated mode
    for tid in sorted(blocked_t):
        r = next(x for x in CTX["routes"] if x["template"] == tid)
        GEN_MUTATIONS.append(("template %s (%s) is reference-only: contains a section blocked in generated mode" % (tid, r["sampleRoute"]), synthesize(tid, r["sampleRoute"], "generated"), {"GENERATED_MODE_BLOCKED_SECTIONS"}))
        controls.append(("REFERENCE template %s (%s) keeps working" % (tid, r["sampleRoute"]), synthesize(tid, r["sampleRoute"], "reference")))
    for name, spec in controls:
        errs = SV.errors(SV.validate(spec, CTX))
        ok = not errs
        fails += 0 if ok else 1
        print("  %s  %s%s" % ("PASS" if ok else "FAIL", name, "" if ok else "  -> " + "; ".join("%s: %s" % (e["rule"], e["message"]) for e in errs[:3])))
    print("== MUTATIONS (expect rejection by the named rule)")
    for name, spec, expect in MUTATIONS:
        rules = {e["rule"] for e in SV.errors(SV.validate(spec, CTX))}
        hit = rules & expect
        ok = bool(hit)
        fails += 0 if ok else 1
        print("  %s  %-48s -> %s" % ("REJECTED" if ok else "ACCEPTED!", name, ",".join(sorted(hit)) if ok else "got %s" % sorted(rules)))
    print("== GENERATED MODE (leak injected into the generation-safe example; expect rejection by the named rule)")
    for name, spec, expect in GEN_MUTATIONS:
        rules = {e["rule"] for e in SV.errors(SV.validate(spec, CTX))}
        hit = rules & expect
        ok = bool(hit)
        fails += 0 if ok else 1
        print("  %s  %-62s -> %s" % ("REJECTED" if ok else "ACCEPTED!", name, ",".join(sorted(hit)) if ok else "got %s" % sorted(rules)))
    print("== REGISTRY (asset-roles.json tampering; verify_all.asset_availability_problems must reject, the real registry must pass)")
    reg_fails, reg_n = registry_checks()
    fails += reg_fails
    print("== RULE-LEVEL (only the named rule evaluated)")
    for name, spec, expect in UNIT:
        rid = name.split(":")[0].split(" ")[0]
        found = SV.validate(spec, CTX, only={rid})
        if rid == "MOTION_BUDGET":
            # warn-severity rule: over budget must WARN (not error); the real homepage must stay silent
            home = SV.validate(C("template.home", "/"), CTX, only={rid})
            ok = any(f["rule"] == rid and f["severity"] == "warn" for f in found) and not home
        else:
            ok = any(f["rule"] == rid and f["severity"] == "error" for f in found)
        fails += 0 if ok else 1
        print("  %s  %s" % (("WARNED" if rid == "MOTION_BUDGET" else "REJECTED") if ok else "FAIL", name))
    total = len(controls) + 1 + len(MUTATIONS) + len(GEN_MUTATIONS) + reg_n + len(UNIT)  # +1: the registry control
    print("adversarial: %d checks, %d controls, %d mutations (%d schema/structural/content + %d generated-mode + %d registry), %d rule-level, %d failure(s)" % (
        total, len(controls) + 1, len(MUTATIONS) + len(GEN_MUTATIONS) + reg_n, len(MUTATIONS), len(GEN_MUTATIONS), reg_n, len(UNIT), fails))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(run())
