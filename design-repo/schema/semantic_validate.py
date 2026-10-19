#!/usr/bin/env python3
"""Semantic validator for Activepieces-clone PageSpecs.

Runs (1) JSON Schema draft-07 validation against schema/pagespec.schema.json and
(2) every rule in compatibility/graph.json, each implemented below in RULES.
The PageSpec's declared `template` is cross-referenced against that template's
REAL node list in templates/templates.json (not nodes[] in isolation).

Usage:
  python3 schema/semantic_validate.py path/to/pagespec.json [--json]
Exit code 0 = no errors (warnings allowed), 1 = errors.
"""
import json
import os
import re
import sys

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    from jsonschema import Draft7Validator
except ImportError:  # pragma: no cover
    sys.exit("semantic_validate.py needs `pip install jsonschema` (draft-07 support).")

HIDDEN_FLOATING = re.compile(r"^/(sales|pricing|admin|customers|blog)(/|$)")
LOOP_TRIGGERS = {"continuous", "interval", "intersection-loop"}
MOTION_BUDGET = 5
FORBIDDEN_BODY_KEYS = {"markdown", "html", "bodyText", "articleBody", "fullText", "prose", "bodyMarkdown"}
PIN_KEYS = ("trigger", "durationMs", "easing", "delayMs", "staggerMs", "intervalMs")


def _load(repo, rel):
    with open(os.path.join(repo, rel), encoding="utf-8") as f:
        return json.load(f)


def load_context(repo=REPO):
    sections = {}
    for name in sorted(os.listdir(os.path.join(repo, "sections"))):
        if name.endswith(".json"):
            s = _load(repo, os.path.join("sections", name))
            sections[s["id"]] = s
    ctx = {
        "repo": repo,
        "schema": _load(repo, "schema/pagespec.schema.json"),
        "sections": sections,
        "templates": _load(repo, "templates/templates.json")["templates"],
        "routes": _load(repo, "templates/routes.json")["routes"],
        "graph": {r["id"]: r for r in _load(repo, "compatibility/graph.json")["rules"]},
        "motion": _load(repo, "tokens/00-foundation/motion.json"),
        "roles": _load(repo, "assets/asset-roles.json")["roles"],
        "policy": _load(repo, "rules/content-policy.json"),
    }
    ctx["validator"] = Draft7Validator(ctx["schema"])
    return ctx


# ------------------------------------------------------------------ helpers
def _nodes(spec):
    n = spec.get("nodes")
    return [x for x in n if isinstance(x, dict)] if isinstance(n, list) else []


def _sec(ctx, node):
    return ctx["sections"].get(node.get("section"))


def _cat(ctx, node):
    s = _sec(ctx, node)
    return s["category"] if s else None


def _strings(value, path=""):
    if isinstance(value, str):
        yield path, value
    elif isinstance(value, dict):
        for k, v in value.items():
            yield from _strings(v, path + "." + k if path else k)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from _strings(v, "%s[%d]" % (path, i))


def _keys(value):
    if isinstance(value, dict):
        for k, v in value.items():
            yield k
            yield from _keys(v)
    elif isinstance(value, list):
        for v in value:
            yield from _keys(v)


def _route_regex(pattern):
    if pattern == "*":
        return re.compile(r"^/.*$"), []
    if pattern.endswith("/*"):
        return re.compile("^" + re.escape(pattern[:-2]) + r"(/.*)?$"), []
    names = re.findall(r":([A-Za-z]+)", pattern)
    rx = "^" + re.sub(r":([A-Za-z]+)", r"(?P<\1>[^/]+)", pattern) + "$"
    return re.compile(rx), names


def match_route(ctx, template, route):
    """Return (routeEntry, params) for the first pattern of `template` matching `route`."""
    for r in ctx["routes"]:
        if r["template"] != template:
            continue
        rx, _ = _route_regex(r["pattern"])
        m = rx.match(route or "")
        if m:
            return r, m.groupdict()
    return None, None


def _words(s):
    return len(re.findall(r"\S+", s))


def _norm(s):
    return " ".join(re.sub(r"[^a-z0-9+ ]", " ", s.lower().replace("’", "'").replace("'", "")).split())


def _resolve(schema, root):
    while isinstance(schema, dict) and "$ref" in schema:
        ref = schema["$ref"]
        cur = root
        for part in ref.lstrip("#/").split("/"):
            cur = cur[part]
        schema = cur
    return schema


# ------------------------------------------------------------------ rules
def r_template_known(spec, ctx, out):
    if spec.get("template") not in ctx["templates"]:
        out("TEMPLATE_KNOWN", "unknown template %r (known: %s)" % (spec.get("template"), ", ".join(sorted(ctx["templates"]))))


def r_route(spec, ctx, out):
    t, route = spec.get("template"), spec.get("route")
    if t not in ctx["templates"]:
        return
    r, params = match_route(ctx, t, route)
    if not r:
        pats = [x["pattern"] for x in ctx["routes"] if x["template"] == t]
        out("ROUTE_MATCHES_TEMPLATE", "route %r does not match any pattern of %s (%s)" % (route, t, ", ".join(pats)))
        return
    for name, rule in r.get("params", {}).items():
        v = params.get(name)
        if v is None:
            continue
        if "enum" in rule and v not in rule["enum"]:
            out("ROUTE_MATCHES_TEMPLATE", "route param %s=%r not in %s" % (name, v, rule["enum"]))
        if "pattern" in rule and not re.match(rule["pattern"], v):
            out("ROUTE_MATCHES_TEMPLATE", "route param %s=%r does not match %s" % (name, v, rule["pattern"]))
        elif "min" in rule and v.isdigit() and int(v) < rule["min"]:
            out("ROUTE_MATCHES_TEMPLATE", "route param %s=%s below minimum %s" % (name, v, rule["min"]))
        elif "max" in rule and v.isdigit() and int(v) > rule["max"]:
            out("ROUTE_MATCHES_TEMPLATE", "route param %s=%s above maximum %s" % (name, v, rule["max"]))


def r_sequence(spec, ctx, out):
    t = ctx["templates"].get(spec.get("template"))
    if not t:
        return
    nodes, slots = _nodes(spec), t["nodes"]
    i = j = 0
    while j < len(slots):
        slot = slots[j]
        node = nodes[i] if i < len(nodes) else None
        if (node is not None and node.get("section") == slot["section"] and not slot["required"]
                and node.get("variant") not in slot["variants"]
                and any(s["section"] == node.get("section") and node.get("variant") in s["variants"] for s in slots[j + 1:])):
            j += 1  # optional slot omitted; a later slot of the same section takes this variant
            continue
        if node is not None and node.get("section") == slot["section"]:
            if node.get("variant") not in slot["variants"]:
                out("NODE_SEQUENCE_MATCHES_TEMPLATE", "node %d (%s) variant %r not allowed in %s slot %d (allowed: %s)" % (
                    i, slot["section"], node.get("variant"), spec["template"], j, ", ".join(slot["variants"])))
            i += 1
            while slot.get("repeatable") and i < len(nodes) and nodes[i].get("section") == slot["section"] and nodes[i].get("variant") in slot["variants"]:
                i += 1
            j += 1
            continue
        if slot["required"]:
            out("NODE_SEQUENCE_MATCHES_TEMPLATE", "%s requires %s (variants %s) at slot %d; found %s" % (
                spec["template"], slot["section"], "/".join(slot["variants"]), j, node.get("section") if node else "end of nodes"))
        j += 1
    for k in range(i, len(nodes)):
        out("NODE_SEQUENCE_MATCHES_TEMPLATE", "node %d (%s/%s) is not part of %s's node sequence at this position" % (
            k, nodes[k].get("section"), nodes[k].get("variant"), spec["template"]))


def r_header_first(spec, ctx, out):
    t = ctx["templates"].get(spec.get("template"))
    nodes = _nodes(spec)
    if not t or not nodes:
        return
    if t.get("standalone"):
        for k, n in enumerate(nodes):
            if str(n.get("section", "")).startswith("shell."):
                out("SHELL_HEADER_FIRST", "%s is standalone (outside Layout); node %d %s is not allowed" % (spec["template"], k, n.get("section")))
    else:
        if nodes[0].get("section") != "shell.header":
            out("SHELL_HEADER_FIRST", "first node must be shell.header, found %s" % nodes[0].get("section"))
        if sum(1 for n in nodes if n.get("section") == "shell.header") > 1:
            out("SHELL_HEADER_FIRST", "shell.header appears more than once")


def r_footer_last(spec, ctx, out):
    t = ctx["templates"].get(spec.get("template"))
    nodes = _nodes(spec)
    if not t or t.get("standalone"):
        return
    idx = [k for k, n in enumerate(nodes) if n.get("section") == "shell.footer-closing"]
    if not idx:
        out("FOOTER_THEN_FLOATING_LAST", "missing shell.footer-closing")
        return
    f = idx[-1]
    tail = [n.get("section") for n in nodes[f + 1:]]
    if tail not in ([], ["shell.floating-card"]):
        out("FOOTER_THEN_FLOATING_LAST", "only shell.floating-card may follow the footer; found %s" % tail)


def r_floating(spec, ctx, out):
    t = ctx["templates"].get(spec.get("template"))
    if not t or t.get("standalone"):
        return
    route = spec.get("route") or ""
    has = any(n.get("section") == "shell.floating-card" for n in _nodes(spec))
    hidden = bool(HIDDEN_FLOATING.match(route))
    if hidden and has:
        out("FLOATING_CARD_ROUTE_RULE", "route %s is under a hidden prefix (/sales,/pricing,/admin,/customers,/blog): remove shell.floating-card" % route)
    if not hidden and not has:
        out("FLOATING_CARD_ROUTE_RULE", "route %s shows the floating card in Layout: add shell.floating-card after the footer" % route)


def r_header_art(spec, ctx, out):
    for n in _nodes(spec):
        if n.get("section") == "shell.header":
            want = "on-art" if spec.get("route") == "/" else "default"
            if n.get("variant") != want:
                out("HEADER_ON_ART_HOME_ONLY", "shell.header variant must be %r on route %s (heroArt only on '/')" % (want, spec.get("route")))


def r_one_hero(spec, ctx, out):
    t = spec.get("template")
    if t not in ctx["templates"]:
        return
    heroes = [n for n in _nodes(spec) if _cat(ctx, n) == "hero"]
    exceptions = set(ctx["graph"]["ONE_HERO"].get("exceptions", []))
    if t in exceptions and heroes:
        out("ONE_HERO", "%s is a named no-hero template; found %d hero node(s)" % (t, len(heroes)))
    elif t not in exceptions and len(heroes) != 1:
        out("ONE_HERO", "%s needs exactly one hero node; found %d" % (t, len(heroes)))


def r_hero_follows(spec, ctx, out):
    nodes = _nodes(spec)
    for k, n in enumerate(nodes):
        if _cat(ctx, n) == "hero" and (k == 0 or nodes[k - 1].get("section") != "shell.header"):
            out("HERO_FOLLOWS_HEADER", "hero node %d (%s) must immediately follow shell.header" % (k, n.get("section")))


def r_one_per_page(spec, ctx, out):
    counts = {}
    for n in _nodes(spec):
        counts[n.get("section")] = counts.get(n.get("section"), 0) + 1
    for sid, c in counts.items():
        s = ctx["sections"].get(sid)
        if not s:
            continue
        cons = s.get("constraints", {})
        if cons.get("onePerPage") and c > 1:
            out("ONE_PER_PAGE", "%s is onePerPage; found %d" % (sid, c))
        if "maxPerPage" in cons and c > cons["maxPerPage"]:
            out("ONE_PER_PAGE", "%s maxPerPage %d; found %d" % (sid, cons["maxPerPage"], c))


def r_home_only(spec, ctx, out):
    for n in _nodes(spec):
        s = _sec(ctx, n)
        if s and s.get("constraints", {}).get("homeRouteOnly") and spec.get("route") != "/":
            out("HOME_ROUTE_ONLY", "%s is homepage-only; route is %s" % (n.get("section"), spec.get("route")))


def r_scroll_stages(spec, ctx, out):
    nodes = _nodes(spec)
    for a, b in zip(nodes, nodes[1:]):
        sa, sb = _sec(ctx, a), _sec(ctx, b)
        if sa and sb and sa.get("constraints", {}).get("scrollStage") and sb.get("constraints", {}).get("scrollStage"):
            out("NO_CONSECUTIVE_SCROLL_STAGES", "scroll stages %s and %s are adjacent" % (a.get("section"), b.get("section")))


def r_same_pair(spec, ctx, out):
    nodes = _nodes(spec)
    for k, (a, b) in enumerate(zip(nodes, nodes[1:])):
        if (a.get("section"), a.get("variant")) == (b.get("section"), b.get("variant")):
            out("NO_ADJACENT_SAME_SECTION_VARIANT", "nodes %d and %d are both %s/%s" % (k, k + 1, a.get("section"), a.get("variant")))


def r_same_category(spec, ctx, out):
    exc = {tuple(p) for p in ctx["graph"]["NO_ADJACENT_SAME_CATEGORY"].get("exceptions", [])}
    nodes = _nodes(spec)
    for a, b in zip(nodes, nodes[1:]):
        ca, cb = _cat(ctx, a), _cat(ctx, b)
        if ca and ca == cb and ca != "shell" and (a.get("section"), b.get("section")) not in exc:
            out("NO_ADJACENT_SAME_CATEGORY", "adjacent %s nodes %s -> %s (not a named exception)" % (ca, a.get("section"), b.get("section")))


def r_motion_allowed(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        s = _sec(ctx, n)
        m = n.get("motion")
        if not s or not isinstance(m, dict):
            continue
        pats = [e.get("pattern") for e in m.get("entries", []) if isinstance(e, dict)]
        allowed = set(s["motion"]["allowedPatterns"])
        for p in pats:
            if p not in allowed:
                out("MOTION_PATTERN_ALLOWED", "node %d %s: pattern %r not allowed (allowed: %s)" % (k, n["section"], p, ", ".join(sorted(allowed))))
        need = list(s["motion"]["requiredPatterns"]) + list(s["motion"].get("variantRequiredPatterns", {}).get(n.get("variant"), []))
        for p in need:
            if p not in pats:
                out("MOTION_PATTERN_ALLOWED", "node %d %s/%s: required motion pattern %r missing" % (k, n["section"], n.get("variant"), p))
        if len(pats) != len(set(pats)):
            out("MOTION_PATTERN_ALLOWED", "node %d %s: duplicate motion pattern entries" % (k, n["section"]))


def r_motion_pinned(spec, ctx, out):
    reg = ctx["motion"]["patterns"]
    for k, n in enumerate(_nodes(spec)):
        m = n.get("motion")
        if not isinstance(m, dict):
            continue
        for e in m.get("entries", []):
            if not isinstance(e, dict) or e.get("pattern") not in reg:
                continue
            p = reg[e["pattern"]]
            for key in PIN_KEYS:
                if key in p and e.get(key) != p[key]:
                    out("MOTION_VALUES_PINNED", "node %d %s: %s.%s must be %r (registry), got %r" % (k, n.get("section"), e["pattern"], key, p[key], e.get(key)))
                if key not in p and key in e:
                    out("MOTION_VALUES_PINNED", "node %d %s: %s has no %s in the registry" % (k, n.get("section"), e["pattern"], key))


def r_fallback(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        s, m = _sec(ctx, n), n.get("motion")
        if s and isinstance(m, dict):
            want = s["motion"]["reducedMotionFallback"]
            if m.get("reducedMotionFallback") != want:
                out("REDUCED_MOTION_FALLBACK", "node %d %s: reducedMotionFallback must be %r" % (k, n["section"], want))


def r_motion_budget(spec, ctx, out):
    c = sum(1 for n in _nodes(spec) for e in (n.get("motion") or {}).get("entries", []) if isinstance(e, dict) and e.get("trigger") in LOOP_TRIGGERS)
    if c > MOTION_BUDGET:
        out("MOTION_BUDGET", "%d continuous/interval/loop motions on one page (budget %d)" % (c, MOTION_BUDGET))


def r_media_roles(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        s = _sec(ctx, n)
        if not s:
            continue
        slots = s["media"]["slots"]
        used = {}
        for item in n.get("media", []) or []:
            if not isinstance(item, dict):
                continue
            slot = slots.get(item.get("slot"))
            if not slot:
                out("MEDIA_ROLE_ALLOWED", "node %d %s: unknown media slot %r" % (k, n["section"], item.get("slot")))
                continue
            if item.get("assetRole") not in slot["roles"]:
                out("MEDIA_ROLE_ALLOWED", "node %d %s: slot %s takes %s, not %r" % (k, n["section"], item["slot"], slot["roles"], item.get("assetRole")))
            used[item["slot"]] = used.get(item["slot"], 0) + 1
        for name, c in used.items():
            if c > slots[name]["maxItems"]:
                out("MEDIA_ROLE_ALLOWED", "node %d %s: slot %s maxItems %d, got %d" % (k, n["section"], name, slots[name]["maxItems"], c))


def r_media_ref(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        for item in n.get("media", []) or []:
            if not isinstance(item, dict):
                continue
            role = ctx["roles"].get(item.get("assetRole"))
            ref = str(item.get("ref", ""))
            if not role:
                continue
            pol = role["policy"]
            if ref.startswith("http:") or ref.startswith("https:") or ref.startswith("//"):
                out("MEDIA_REF_POLICY", "node %d: external media ref %r (no runtime external requests)" % (k, ref))
                continue
            ok = {
                "placeholder-only": ref.startswith("placeholder:"),
                "data-bound-only": re.match(r"^data:[a-z-]+#[A-Za-z0-9._/-]+$", ref) is not None,
                "reuse-exact-path": ref in role.get("paths", []),
                "reuse-closed-set": ref in role.get("paths", []),
                "may-generate-synthetic": ref in role.get("paths", []) or ref.startswith("generated:") or ref.startswith("placeholder:"),
            }.get(pol, False)
            if not ok:
                out("MEDIA_REF_POLICY", "node %d %s: %s is %s; ref %r violates it (%s)" % (k, n.get("section"), item["assetRole"], pol, ref, role["refRule"]))


def r_required_media(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        s = _sec(ctx, n)
        if not s:
            continue
        have = {i.get("slot") for i in (n.get("media") or []) if isinstance(i, dict)}
        for name, slot in s["media"]["slots"].items():
            if slot.get("required") and name not in have:
                out("REQUIRED_MEDIA_SLOT", "node %d %s: required media slot %r missing" % (k, n["section"], name))


def r_max_words(spec, ctx, out):
    root = ctx["schema"]

    def walk(schema, value, path):
        schema = _resolve(schema, root)
        if not isinstance(schema, dict):
            return
        if isinstance(value, str) and "x-maxWords" in schema:
            w = _words(value)
            if w > schema["x-maxWords"]:
                out("MAX_WORDS", "%s has %d words (max %d)" % (path, w, schema["x-maxWords"]))
        elif isinstance(value, dict):
            for key, v in value.items():
                sub = schema.get("properties", {}).get(key)
                if sub is not None:
                    walk(sub, v, path + "." + key)
        elif isinstance(value, list) and isinstance(schema.get("items"), dict):
            for i, v in enumerate(value):
                walk(schema["items"], v, "%s[%d]" % (path, i))

    if isinstance(spec.get("meta"), dict):
        walk({"$ref": "#/definitions/meta"}, spec["meta"], "meta")
    for k, n in enumerate(_nodes(spec)):
        if n.get("section") in ctx["sections"] and isinstance(n.get("content"), dict):
            walk({"$ref": "#/definitions/content." + n["section"]}, n["content"], "nodes[%d].content" % k)


def r_variant_rules(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        s = _sec(ctx, n)
        c = n.get("content")
        if not s or not isinstance(c, dict):
            continue
        rules = s.get("variantRules", {}).get(n.get("variant"), {})
        tag = "node %d %s/%s" % (k, n["section"], n.get("variant"))
        for f in rules.get("requiredContent", []):
            if f not in c:
                out("VARIANT_RULES", "%s requires content.%s" % (tag, f))
        for f in rules.get("forbiddenContent", []):
            if f in c:
                out("VARIANT_RULES", "%s forbids content.%s" % (tag, f))
        anyf = rules.get("requiredAnyContent")
        if anyf and not any(f in c for f in anyf):
            out("VARIANT_RULES", "%s requires one of content.%s" % (tag, "/".join(anyf)))
        for f, cnt in rules.get("itemCount", {}).items():
            if isinstance(c.get(f), list) and len(c[f]) != cnt:
                out("VARIANT_RULES", "%s needs exactly %d %s (got %d)" % (tag, cnt, f, len(c[f])))
        for f, val in rules.get("contentEquals", {}).items():
            if f in c and c[f] != val:
                out("VARIANT_RULES", "%s requires content.%s == %r" % (tag, f, val))
        for f, val in rules.get("minValue", {}).items():
            if isinstance(c.get(f), int) and c[f] < val:
                out("VARIANT_RULES", "%s requires content.%s >= %d" % (tag, f, val))


def r_bento(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        if n.get("section") != "bento.grid" or not isinstance(n.get("content"), dict):
            continue
        acc = 0
        for i, card in enumerate(n["content"].get("cards", [])):
            acc += card.get("span", 0) if isinstance(card, dict) else 0
            if acc > 24:
                out("BENTO_ROW_SUM_24", "node %d bento card %d overflows its 24-column row" % (k, i))
                acc = 0
            elif acc == 24:
                acc = 0
        if acc:
            out("BENTO_ROW_SUM_24", "node %d bento last row sums to %d, not 24" % (k, acc))


def r_kind(spec, ctx, out):
    kinds = {n["content"]["kind"] for n in _nodes(spec) if isinstance(n.get("content"), dict) and "kind" in n["content"]}
    if len(kinds) > 1:
        out("CATALOG_KIND_CONSISTENT", "mixed catalog kinds on one page: %s" % sorted(kinds))
    route = spec.get("route") or ""
    want = "mcp" if route.startswith("/mcp") else "pieces" if route.startswith("/pieces") else None
    if want and kinds and kinds != {want}:
        out("CATALOG_KIND_CONSISTENT", "route %s needs kind %r, got %s" % (route, want, sorted(kinds)))


def _slug(ref):
    return ref.split("#", 1)[1] if isinstance(ref, str) and "#" in ref else None


def r_route_subject(spec, ctx, out):
    t, route = spec.get("template"), spec.get("route") or ""
    r, params = match_route(ctx, t, route) if t in ctx["templates"] else (None, None)
    if not r:
        return
    for k, n in enumerate(_nodes(spec)):
        c = n.get("content") if isinstance(n.get("content"), dict) else {}
        sec, var = n.get("section"), n.get("variant")
        if t == "template.catalog-detail" and "subject" in c and _slug(c["subject"]) != params.get("slug"):
            out("ROUTE_SUBJECT_MATCH", "node %d %s subject %r != route slug %r" % (k, sec, c["subject"], params.get("slug")))
        if t == "template.catalog-pair":
            a, b = params.get("a"), params.get("b")
            if a == b and k == 0:
                out("ROUTE_SUBJECT_MATCH", "pair route needs two distinct slugs (%s)" % route)
            expect = {"hero.catalog-detail": (a, b, "subjectB"), "catalog.capability-list": (a, b, "subjectB"),
                      "catalog.related-grid": ((a, b, "exclude") if var == "pair-source" else (b, a, "exclude"))}.get(sec)
            if expect and "subject" in c:
                s1, s2, f2 = expect
                if _slug(c.get("subject")) != s1 or _slug(c.get(f2)) != s2:
                    out("ROUTE_SUBJECT_MATCH", "node %d %s/%s subjects (%s, %s) do not match route (%s, %s)" % (k, sec, var, _slug(c.get("subject")), _slug(c.get(f2)), s1, s2))
            if sec == "hero.catalog-detail" and c.get("subject") and c.get("subject") == c.get("subjectB"):
                out("ROUTE_SUBJECT_MATCH", "pair subjects must be distinct")
        if sec == "content.legal" and c.get("doc") and route != "/" + c["doc"]:
            out("ROUTE_SUBJECT_MATCH", "content.legal doc %r does not match route %s" % (c["doc"], route))


def r_denylist(spec, ctx, out):
    d = ctx["policy"]["realEntityDenylist"]
    terms = [t for key in ("customers", "people", "platformsAndTrademarks", "blogAuthors") for t in d.get(key, [])]
    pats = [(t, re.compile(r"(?<![A-Za-z0-9])" + re.escape(t) + r"(?![A-Za-z0-9])")) for t in terms]
    sources = [("meta", spec.get("meta"))] + [("nodes[%d].content" % k, n.get("content")) for k, n in enumerate(_nodes(spec))]
    for base, val in sources:
        for path, s in _strings(val):
            for t, p in pats:
                if p.search(s):
                    out("REAL_ENTITY_DENYLIST", "%s.%s names real entity %r; use synthetic names" % (base, path, t))


def r_verbatim(spec, ctx, out):
    fps = [(_norm(f["text"]), f["text"]) for f in ctx["policy"]["realCopyFingerprints"]]
    sources = [("meta", spec.get("meta"))] + [("nodes[%d].content" % k, n.get("content")) for k, n in enumerate(_nodes(spec))]
    for base, val in sources:
        for path, s in _strings(val):
            ns = _norm(s)
            for nf, raw in fps:
                if nf and (ns == nf or (len(nf.split()) >= 4 and nf in ns)):
                    out("REAL_COPY_VERBATIM", "%s.%s reproduces real Activepieces copy %r" % (base, path, raw))


def r_bodies(spec, ctx, out):
    for k, n in enumerate(_nodes(spec)):
        bad = [x for x in _keys(n.get("content")) if x in FORBIDDEN_BODY_KEYS]
        if bad:
            out("NO_STORED_BODIES", "node %d %s carries body-like field(s) %s; bodies are never stored or generated" % (k, n.get("section"), bad))
        c = n.get("content") if isinstance(n.get("content"), dict) else {}
        if n.get("section") in ("content.article", "content.resource-detail", "content.legal") and c.get("bodyMode") != "placeholder":
            out("NO_STORED_BODIES", "node %d %s bodyMode must be 'placeholder'" % (k, n.get("section")))


def r_links(spec, ctx, out):
    hosts = ctx["policy"]["outboundHostAllowlist"]
    for k, n in enumerate(_nodes(spec)):
        for path, s in _strings(n.get("content")):
            last = path.split(".")[-1].split("[")[0]
            if last == "href" or last.endswith("Href"):
                if s.startswith("/") and not s.startswith("//"):
                    continue
                m = re.match(r"^https://([^?#]+)", s)
                if not m or not any(m.group(1) == h or m.group(1).startswith(h + "/") for h in hosts):
                    out("OUTBOUND_LINK_HOSTS", "node %d content.%s %r is not internal or an allowlisted host" % (k, path, s))


def r_ids(spec, ctx, out):
    seen = set()
    for k, n in enumerate(_nodes(spec)):
        i = n.get("id")
        if i in seen:
            out("UNIQUE_NODE_IDS", "node %d id %r is duplicated" % (k, i))
        seen.add(i)


RULES = {
    "TEMPLATE_KNOWN": r_template_known,
    "ROUTE_MATCHES_TEMPLATE": r_route,
    "NODE_SEQUENCE_MATCHES_TEMPLATE": r_sequence,
    "SHELL_HEADER_FIRST": r_header_first,
    "FOOTER_THEN_FLOATING_LAST": r_footer_last,
    "FLOATING_CARD_ROUTE_RULE": r_floating,
    "HEADER_ON_ART_HOME_ONLY": r_header_art,
    "ONE_HERO": r_one_hero,
    "HERO_FOLLOWS_HEADER": r_hero_follows,
    "ONE_PER_PAGE": r_one_per_page,
    "HOME_ROUTE_ONLY": r_home_only,
    "NO_CONSECUTIVE_SCROLL_STAGES": r_scroll_stages,
    "NO_ADJACENT_SAME_SECTION_VARIANT": r_same_pair,
    "NO_ADJACENT_SAME_CATEGORY": r_same_category,
    "MOTION_PATTERN_ALLOWED": r_motion_allowed,
    "MOTION_VALUES_PINNED": r_motion_pinned,
    "REDUCED_MOTION_FALLBACK": r_fallback,
    "MOTION_BUDGET": r_motion_budget,
    "MEDIA_ROLE_ALLOWED": r_media_roles,
    "MEDIA_REF_POLICY": r_media_ref,
    "REQUIRED_MEDIA_SLOT": r_required_media,
    "MAX_WORDS": r_max_words,
    "VARIANT_RULES": r_variant_rules,
    "BENTO_ROW_SUM_24": r_bento,
    "CATALOG_KIND_CONSISTENT": r_kind,
    "ROUTE_SUBJECT_MATCH": r_route_subject,
    "REAL_ENTITY_DENYLIST": r_denylist,
    "REAL_COPY_VERBATIM": r_verbatim,
    "NO_STORED_BODIES": r_bodies,
    "OUTBOUND_LINK_HOSTS": r_links,
    "UNIQUE_NODE_IDS": r_ids,
}


def validate(spec, ctx=None, only=None, schema=True):
    """Return a list of findings {severity, rule, message}. `only` restricts to a set of rule ids."""
    ctx = ctx or load_context()
    findings = []
    if schema and only is None:
        for e in sorted(ctx["validator"].iter_errors(spec), key=lambda e: list(e.absolute_path)):
            loc = "/".join(str(p) for p in e.absolute_path) or "(root)"
            findings.append({"severity": "error", "rule": "SCHEMA", "message": "%s: %s" % (loc, e.message[:300])})
    if not isinstance(spec, dict):
        return findings
    for rid, fn in RULES.items():
        if only is not None and rid not in only:
            continue
        sev = ctx["graph"].get(rid, {}).get("severity", "error")

        def out(rule, msg, _sev=sev):
            findings.append({"severity": _sev, "rule": rule, "message": msg})
        try:
            fn(spec, ctx, out)
        except Exception as exc:  # malformed input that the schema already rejected
            findings.append({"severity": "error", "rule": rid, "message": "could not evaluate (%s: %s)" % (type(exc).__name__, exc)})
    return findings


def errors(findings):
    return [f for f in findings if f["severity"] == "error"]


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    with open(argv[1], encoding="utf-8") as f:
        spec = json.load(f)
    findings = validate(spec)
    if "--json" in argv:
        print(json.dumps(findings, indent=2))
    else:
        for x in findings:
            print("%-5s %-34s %s" % (x["severity"].upper(), x["rule"], x["message"]))
        errs = errors(findings)
        print("%s: %d error(s), %d warning(s)" % ("FAIL" if errs else "OK", len(errs), len(findings) - len(errs)))
    return 1 if errors(findings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
