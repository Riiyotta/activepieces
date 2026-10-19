#!/usr/bin/env python3
"""One-shot verification of the design-repo.

Self-contained: the repo root is derived from this file's location. Checks that
need the sibling SOURCE project (citations, implementedBy, App.jsx route parity,
asset paths, package.json drift) run only when the source tree is present at
`<repo>/..` (or at $DESIGN_REPO_SOURCE_ROOT); otherwise they WARN and are skipped,
so a standalone copy / unzipped delivery still passes.

Usage: python3 extraction/verify_all.py [--quiet]
Exit 0 = all checks pass (warnings allowed), 1 = at least one failure.
"""
import json
import os
import re
import sys

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, "schema"))

import build_schema  # noqa: E402
import semantic_validate as SV  # noqa: E402
from jsonschema import Draft7Validator  # noqa: E402

EXPECTED_PINNED = {"customer.logo": "placeholder-only", "case-study.logo": "placeholder-only", "testimonial.avatar": "placeholder-only",
                   "review-platform.mark": "placeholder-only", "author.photo": "placeholder-only"}
TEXT_EXT = (".json", ".py", ".md", ".txt", ".sh")
# literals are split so this file does not match its own check (or a repo-wide grep)
ABS_PATTERNS = [re.compile(p) for p in ("/" + "Users/", "/" + "private/tmp", "/" + "private/var", r"(?<![A-Za-z0-9.])/" + "tmp/", r"/home/[a-z]", r"[A-Z]:\\\\Users")]
JUNK = {".DS_Store", "__MACOSX", "__pycache__", "Thumbs.db"}


class Report:
    def __init__(self):
        self.fail, self.warn, self.ok = [], [], []

    def check(self, name, problems, warn_only=False):
        if problems:
            (self.warn if warn_only else self.fail).append((name, problems))
        else:
            self.ok.append(name)


def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def repo_files():
    out = []
    for d, dirs, files in os.walk(REPO):
        dirs[:] = sorted(x for x in dirs)
        for f in sorted(files):
            out.append(os.path.relpath(os.path.join(d, f), REPO).replace(os.sep, "/"))
    return out


def source_root():
    env = os.environ.get("DESIGN_REPO_SOURCE_ROOT")
    root = env if env else os.path.dirname(REPO)
    ok = os.path.isfile(os.path.join(root, "src", "App.jsx")) and os.path.isfile(os.path.join(root, "package.json"))
    if ok:
        try:
            with open(os.path.join(root, "package.json"), encoding="utf-8") as f:
                ok = json.load(f).get("name") == "activepieces-clone"
        except ValueError:
            ok = False
    return root if ok else None


def leaves(node, prefix=""):
    out = {}
    for k, v in node.items():
        if isinstance(v, dict) and "$value" in v:
            out[prefix + k] = v
        elif isinstance(v, dict):
            out.update(leaves(v, prefix + k + "."))
    return out


def iter_citations(value, where=""):
    if isinstance(value, dict):
        if set(value.keys()) == {"file", "lines", "quote"}:
            yield where, value
        else:
            for k, v in value.items():
                yield from iter_citations(v, where + "/" + k)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from iter_citations(v, "%s[%d]" % (where, i))


def compute_counts():
    tok = 0
    for layer in ("00-foundation", "10-semantic", "20-component", "30-layout"):
        for name in os.listdir(os.path.join(REPO, "tokens", layer)):
            if name.endswith(".json"):
                tok += len(leaves(load("tokens/%s/%s" % (layer, name))["tokens"]))
    sections = [f for f in os.listdir(os.path.join(REPO, "sections")) if f.endswith(".json")]
    variants = sum(len(load("sections/" + f)["variants"]) for f in sections)
    templates = load("templates/templates.json")["templates"]
    routes = load("templates/routes.json")
    graph = load("compatibility/graph.json")["rules"]
    return {
        "tokens": tok,
        "foundationTokens": sum(len(leaves(load("tokens/00-foundation/" + n)["tokens"])) for n in os.listdir(os.path.join(REPO, "tokens/00-foundation")) if n.endswith(".json")),
        "semanticTokens": len(leaves(load("tokens/10-semantic/semantic.json")["tokens"])),
        "primitives": len([f for f in os.listdir(os.path.join(REPO, "primitives")) if f.endswith(".json")]),
        "components": len([f for f in os.listdir(os.path.join(REPO, "components")) if f.endswith(".json")]),
        "sections": len(sections),
        "sectionVariants": variants,
        "templates": len(templates),
        "routePatterns": len(routes["routes"]),
        "concreteUrlsEnumerable": routes["facts"]["concreteUrlsEnumerable"],
        "assetRoles": len(load("assets/asset-roles.json")["roles"]),
        "motionPatterns": len(load("tokens/00-foundation/motion.json")["patterns"]),
        "graphRules": len(graph),
        "tailwindV3V4Rules": len(load("rules/tailwind-v3-v4.json")["rules"]),
        "examplePageSpecs": len([f for f in os.listdir(os.path.join(REPO, "schema")) if f.startswith("example") and f.endswith(".pagespec.json")]),
    }


def main():
    quiet = "--quiet" in sys.argv
    R = Report()
    files = repo_files()
    src = source_root()

    # 1 junk + absolute paths
    R.check("NO_JUNK_FILES", [f for f in files if any(part in JUNK for part in f.split("/"))])
    abs_hits = []
    for f in files:
        if f.endswith(TEXT_EXT):
            with open(os.path.join(REPO, f), encoding="utf-8", errors="replace") as fh:
                for ln, line in enumerate(fh, 1):
                    for p in ABS_PATTERNS:
                        if p.search(line):
                            abs_hits.append("%s:%d" % (f, ln))
    R.check("NO_ABSOLUTE_PATHS", abs_hits)

    # 2 json parse
    bad = []
    for f in files:
        if f.endswith(".json"):
            try:
                load(f)
            except ValueError as e:
                bad.append("%s: %s" % (f, e))
    R.check("JSON_PARSE", bad)
    if bad:
        return finish(R, quiet)

    manifest = load("registry.manifest.json")
    allow = load("tokens/llm/component-allowlist.json")
    schema = load("schema/pagespec.schema.json")
    sections = {load("sections/" + f)["id"]: load("sections/" + f) for f in os.listdir(os.path.join(REPO, "sections")) if f.endswith(".json")}
    templates = load("templates/templates.json")["templates"]
    routes = load("templates/routes.json")["routes"]
    motion = load("tokens/00-foundation/motion.json")
    roles_doc = load("assets/asset-roles.json")
    roles = roles_doc["roles"]
    graph = load("compatibility/graph.json")["rules"]

    # 3 manifest entry points: inside repo, exist, cover every file
    ep = manifest.get("entryPoints", [])
    probs = ["not a flat list of strings"] if not (isinstance(ep, list) and all(isinstance(x, str) for x in ep)) else []
    for e in ep if not probs else []:
        if e.startswith("/") or ".." in e.split("/"):
            probs.append("outside repo: %s" % e)
        elif not os.path.isfile(os.path.join(REPO, e)):
            probs.append("missing: %s" % e)
    if not probs:
        listed = set(ep)
        probs += ["not listed in entryPoints: %s" % f for f in files if f not in listed]
    R.check("MANIFEST_ENTRYPOINTS", probs)

    # 4 schema meta-valid + in sync with contracts
    try:
        Draft7Validator.check_schema(schema)
        R.check("SCHEMA_META_VALID", [])
    except Exception as e:  # noqa: BLE001
        R.check("SCHEMA_META_VALID", [str(e)[:300]])
    R.check("SCHEMA_IN_SYNC", [] if build_schema.dumps(build_schema.build(REPO)) == open(os.path.join(REPO, "schema/pagespec.schema.json"), encoding="utf-8").read()
            else ["schema/pagespec.schema.json differs from build_schema.build() (run python3 schema/build_schema.py)"])

    # 5 examples validate with 0 errors
    ctx = SV.load_context(REPO)
    probs = []
    for f in sorted(x for x in os.listdir(os.path.join(REPO, "schema")) if x.startswith("example") and x.endswith(".pagespec.json")):
        errs = SV.errors(SV.validate(load("schema/" + f), ctx))
        probs += ["%s: %s %s" % (f, e["rule"], e["message"]) for e in errs]
    R.check("EXAMPLES_VALID", probs)

    # 6 allowlist parity
    probs = []
    prim_files = {"primitive." + f[:-5] for f in os.listdir(os.path.join(REPO, "primitives")) if f.endswith(".json")}
    comp_files = {"component." + f[:-5] for f in os.listdir(os.path.join(REPO, "components")) if f.endswith(".json")}
    for label, a, b in (("primitives", set(allow["primitives"]), prim_files), ("components", set(allow["components"]), comp_files),
                        ("sections", set(allow["sections"]), set(sections)), ("templates", set(allow["templates"]), set(templates)),
                        ("templates(schema)", set(allow["templates"]), set(schema["properties"]["template"]["enum"])),
                        ("sections(schema)", set(allow["sections"]), set(schema["definitions"]["node"]["properties"]["section"]["enum"])),
                        ("assetRoles", set(allow["assetRoles"]), set(roles)), ("assetRoles(schema)", set(allow["assetRoles"]), set(schema["definitions"]["mediaItem"]["properties"]["assetRole"]["enum"])),
                        ("motionPatterns", set(allow["motionPatterns"]), set(motion["patterns"])), ("motionPatterns(schema)", set(allow["motionPatterns"]), set(schema["definitions"]["motionEntry"]["properties"]["pattern"]["enum"])),
                        ("reducedMotionFallbacks", set(allow["reducedMotionFallbacks"]), set(motion["reducedMotionFallbacks"])),
                        ("nodeProperties(schema)", set(allow["nodeProperties"]), set(schema["definitions"]["node"]["properties"]))):
        if a - b:
            probs.append("%s: phantom allowlist entries %s" % (label, sorted(a - b)))
        if b - a:
            probs.append("%s: real entries missing from allowlist %s" % (label, sorted(b - a)))
    for f in os.listdir(os.path.join(REPO, "primitives")) + os.listdir(os.path.join(REPO, "components")):
        pass
    for kind, d in (("primitive", "primitives"), ("component", "components")):
        for f in os.listdir(os.path.join(REPO, d)):
            if f.endswith(".json") and load(d + "/" + f).get("id") != "%s.%s" % (kind, f[:-5]):
                probs.append("%s/%s id does not match filename" % (d, f))
    for sid, a in allow["sections"].items():
        s = sections.get(sid)
        if not s:
            continue
        for key, real in (("variants", sorted(s["variants"])), ("contentFields", sorted(s["content"]["properties"])), ("mediaSlots", sorted(s["media"]["slots"])),
                          ("motionPatterns", sorted(s["motion"]["allowedPatterns"]))):
            if a.get(key) != real:
                probs.append("%s.%s allowlist %s != contract %s" % (sid, key, a.get(key), real))
    R.check("ALLOWLIST_PARITY", probs)

    # 7 version parity (machine-checked versions only)
    probs = []
    if manifest.get("allowlistVersion") != allow.get("version"):
        probs.append("manifest.allowlistVersion %r != allowlist.version %r" % (manifest.get("allowlistVersion"), allow.get("version")))
    if manifest.get("pageSpecVersion") != schema["properties"]["pageSpecVersion"]["const"]:
        probs.append("manifest.pageSpecVersion != schema pageSpecVersion const")
    R.check("VERSION_PARITY", probs)

    # 8 counts recomputed
    real = compute_counts()
    claimed = manifest.get("counts", {})
    R.check("COUNTS_RECOMPUTE", ["counts.%s claims %r, disk has %r" % (k, claimed.get(k), v) for k, v in real.items() if claimed.get(k) != v]
            + ["counts.%s is not a recomputed count" % k for k in claimed if k not in real])
    readme = open(os.path.join(REPO, "README.md"), encoding="utf-8").read()
    probs = []
    for k, v in real.items():
        m = re.search(r"^\| %s \| ([0-9,]+) \|" % re.escape(k), readme, re.M)
        if not m:
            probs.append("README counts table lacks row %r" % k)
        elif int(m.group(1).replace(",", "")) != v:
            probs.append("README says %s = %s, disk has %d" % (k, m.group(1), v))
    R.check("README_COUNTS", probs)

    # 9 template/section/route coverage
    probs = []
    for tid, t in templates.items():
        for i, n in enumerate(t["nodes"]):
            s = sections.get(n["section"])
            if not s:
                probs.append("%s node %d: unknown section %s" % (tid, i, n["section"]))
                continue
            for v in n["variants"]:
                if v not in s["variants"]:
                    probs.append("%s node %d: %s has no variant %s" % (tid, i, n["section"], v))
        if not any(r["template"] == tid for r in routes):
            probs.append("%s has no route" % tid)
    pats = [r["pattern"] for r in routes]
    probs += ["duplicate route pattern %s" % p for p in set(pats) if pats.count(p) > 1]
    probs += ["route %s -> unknown template %s" % (r["pattern"], r["template"]) for r in routes if r["template"] not in templates]
    used = {n["section"] for t in templates.values() for n in t["nodes"]}
    probs += ["section %s is used by no template" % s for s in sections if s not in used]
    R.check("TEMPLATE_ROUTE_COVERAGE", probs)

    # 10 graph <-> validator agreement (+ exceptions derived from templates)
    probs = []
    gids = {r["id"] for r in graph}
    if gids - set(SV.RULES):
        probs.append("graph rules without validator implementation: %s" % sorted(gids - set(SV.RULES)))
    if set(SV.RULES) - gids:
        probs.append("validator rules missing from graph.json: %s" % sorted(set(SV.RULES) - gids))
    cat = {k: v["category"] for k, v in sections.items()}
    no_hero = sorted(t for t, d in templates.items() if not any(cat.get(n["section"]) == "hero" for n in d["nodes"]))
    gmap = {r["id"]: r for r in graph}
    if gmap.get("ONE_HERO", {}).get("exceptions") != no_hero:
        probs.append("ONE_HERO exceptions %s != templates without a hero %s" % (gmap.get("ONE_HERO", {}).get("exceptions"), no_hero))
    adj = sorted({(a["section"], b["section"]) for t in templates.values() for a, b in zip(t["nodes"], t["nodes"][1:])
                  if cat.get(a["section"]) == cat.get(b["section"]) and cat.get(a["section"]) != "shell"})
    if sorted(tuple(x) for x in gmap.get("NO_ADJACENT_SAME_CATEGORY", {}).get("exceptions", [])) != adj:
        probs.append("NO_ADJACENT_SAME_CATEGORY exceptions do not equal the adjacencies observed in templates.json")
    for r in graph:
        if r.get("severity") not in ("error", "warn"):
            probs.append("%s has severity %r" % (r["id"], r.get("severity")))
    R.check("GRAPH_VALIDATOR_AGREEMENT", probs)

    # 11 asset roles: closed policies + pinned values
    probs = []
    pols = set(roles_doc["generationPolicies"])
    for rid, r in roles.items():
        if r.get("policy") not in pols:
            probs.append("%s policy %r not in generationPolicies" % (rid, r.get("policy")))
        if not r.get("guidance") or not r.get("evidence"):
            probs.append("%s lacks guidance/evidence" % rid)
    for rid, want in EXPECTED_PINNED.items():
        if roles.get(rid, {}).get("policy") != want:
            probs.append("pinned role %s must be %r, found %r" % (rid, want, roles.get(rid, {}).get("policy")))
        if roles_doc.get("pinnedPolicies", {}).get(rid) != want:
            probs.append("pinnedPolicies.%s must be %r" % (rid, want))
    for sid, s in sections.items():
        for slot, d in s["media"]["slots"].items():
            for role in d["roles"]:
                if role not in roles:
                    probs.append("%s slot %s uses unknown role %s" % (sid, slot, role))
    R.check("ASSET_ROLE_POLICIES", probs)

    # 12 section contracts complete and internally consistent
    probs = []
    bps = set(leaves(load("tokens/00-foundation/breakpoint.json")["tokens"]["breakpoint"])) | {"base"}
    for sid, s in sections.items():
        m = s["motion"]
        if m["reducedMotionFallback"] not in motion["reducedMotionFallbacks"]:
            probs.append("%s: unknown reducedMotionFallback" % sid)
        for p in m["allowedPatterns"]:
            if p not in motion["patterns"]:
                probs.append("%s: unknown motion pattern %s" % (sid, p))
        for p in m["requiredPatterns"] + [x for v in m["variantRequiredPatterns"].values() for x in v]:
            if p not in m["allowedPatterns"]:
                probs.append("%s: required pattern %s not allowed" % (sid, p))
        for v in list(m["variantRequiredPatterns"]) + list(s.get("variantRules", {})):
            if v not in s["variants"]:
                probs.append("%s: rules for unknown variant %s" % (sid, v))
        for k in s["responsive"]["changes"]:
            if k not in bps:
                probs.append("%s: responsive key %s is not a breakpoint token" % (sid, k))
        if not s["evidence"] or not s["implementedBy"]:
            probs.append("%s: missing evidence/implementedBy" % sid)

        def walk(sch, path):
            if not isinstance(sch, dict):
                return
            if sch.get("type") == "string" and "pattern" not in sch and "x-maxWords" not in sch:
                probs.append("%s: text field %s has no x-maxWords" % (sid, path))
            if sch.get("type") == "object" and sch.get("additionalProperties") is not False:
                probs.append("%s: object %s is not closed (additionalProperties:false)" % (sid, path))
            for k, v in sch.get("properties", {}).items():
                walk(v, path + "." + k)
            if isinstance(sch.get("items"), dict):
                walk(sch["items"], path + "[]")
        walk(s["content"], "content")
    for k in ("additionalProperties",):
        for d in ("motion", "motionEntry", "mediaItem", "node", "meta"):
            if schema["definitions"][d].get(k) is not False:
                probs.append("schema definitions.%s is not closed" % d)
    R.check("SECTION_CONTRACTS", probs)

    # 13 tokens: references resolve, theme matches, catalog/policy keys are real
    probs = []
    foundation = {}
    for n in os.listdir(os.path.join(REPO, "tokens/00-foundation")):
        if n.endswith(".json"):
            foundation.update(load("tokens/00-foundation/" + n)["tokens"])
    flat_f = leaves(foundation)
    sem = load("tokens/10-semantic/semantic.json")["tokens"]
    flat_s = leaves(sem)

    def resolve(ref):
        seen = 0
        while isinstance(ref, str) and ref.startswith("{") and seen < 5:
            key = ref.strip("{}")
            if key in flat_f:
                ref = flat_f[key]["$value"]
            elif key in flat_s:
                ref = flat_s[key]["$value"]
            else:
                return None
            seen += 1
        return ref
    resolved = {}
    for k, v in flat_s.items():
        r = resolve(v["$value"])
        if r is None:
            probs.append("semantic %s -> unresolved %s" % (k, v["$value"]))
        resolved[k] = r
    if load("tokens/themes/light.json")["resolved"] != resolved:
        probs.append("tokens/themes/light.json does not equal the recomputed semantic resolution")
    for layer in ("20-component", "30-layout"):
        for n in os.listdir(os.path.join(REPO, "tokens", layer)):
            for k, v in leaves(load("tokens/%s/%s" % (layer, n))["tokens"]).items():
                for ref in re.findall(r"\{([a-zA-Z0-9.\-]+)\}", json.dumps(v["$value"])):
                    if ref not in flat_f and ref not in flat_s:
                        probs.append("%s %s -> unresolved {%s}" % (n, k, ref))
    R.check("TOKEN_REFERENCES", probs)
    probs = []
    real_ns = set()
    for layer in ("00-foundation", "10-semantic", "20-component", "30-layout"):
        for n in os.listdir(os.path.join(REPO, "tokens", layer)):
            real_ns |= set(load("tokens/%s/%s" % (layer, n))["tokens"])
    cat_doc = load("tokens/llm/token-catalog.json")
    if set(cat_doc["namespaces"]) != real_ns:
        probs.append("token-catalog namespaces %s != real token keys %s" % (sorted(cat_doc["namespaces"]), sorted(real_ns)))
    pol = load("tokens/llm/token-policy.json")
    probs += ["token-policy rawValueRestrictions key %r is not a catalog namespace" % k for k in pol["rawValueRestrictions"] if k not in cat_doc["namespaces"]]
    for ns, d in cat_doc["namespaces"].items():
        for p in d["paths"]:
            if p not in flat_f and p not in flat_s and not any(p in leaves(load("tokens/%s/%s" % (l, n))["tokens"]) for l in ("20-component", "30-layout") for n in os.listdir(os.path.join(REPO, "tokens", l))):
                probs.append("catalog path %s does not exist" % p)
    if allow.get("version") != cat_doc.get("version") or allow.get("version") != pol.get("version"):
        probs.append("token-catalog/token-policy version != allowlist version")
    R.check("TOKEN_CATALOG_KEYS", probs)

    # 14 citations (source-dependent)
    cites = []
    for f in files:
        if f.endswith(".json"):
            cites += [(f, w, c) for w, c in iter_citations(load(f))]
    if not src:
        R.check("CITATIONS", ["sibling source tree not found: %d citations not checked (standalone copy)" % len(cites)], warn_only=True)
    else:
        probs, cache = [], {}
        for f, where, c in cites:
            path = os.path.join(src, c["file"])
            if c["file"].startswith("/") or ".." in c["file"].split("/"):
                probs.append("%s%s: citation path must be source-relative: %s" % (f, where, c["file"]))
                continue
            if not os.path.isfile(path):
                probs.append("%s%s: missing file %s" % (f, where, c["file"]))
                continue
            if path not in cache:
                with open(path, encoding="utf-8", errors="replace") as fh:
                    cache[path] = fh.read().split("\n")
            lines = cache[path]
            m = re.match(r"^(\d+)(?:-(\d+))?$", c["lines"])
            if not m:
                probs.append("%s%s: bad line range %r" % (f, where, c["lines"]))
                continue
            a, b = int(m.group(1)), int(m.group(2) or m.group(1))
            if a < 1 or b < a or b > len(lines):
                probs.append("%s%s: %s:%s out of range (file has %d lines)" % (f, where, c["file"], c["lines"], len(lines)))
                continue
            if c["quote"] not in "\n".join(lines[a - 1:b]):
                probs.append("%s%s: quote %r not found in %s:%s" % (f, where, c["quote"][:60], c["file"], c["lines"]))
        R.check("CITATIONS", probs)

    # 15 other source-dependent drift checks
    if not src:
        R.check("SOURCE_DRIFT", ["sibling source tree not found: implementedBy / App.jsx routes / asset paths / package.json not checked"], warn_only=True)
    else:
        probs = []
        impl = set()
        for s in sections.values():
            impl |= set(s["implementedBy"]) | {p for v in s["variants"].values() for p in v.get("implementedBy", [])}
        for t in templates.values():
            impl |= set(t["implementedBy"])
        for d in ("primitives", "components"):
            for f in os.listdir(os.path.join(REPO, d)):
                impl |= set(load(d + "/" + f).get("implementedBy", []))
        probs += ["implementedBy missing in source: %s" % p for p in sorted(impl) if not os.path.isfile(os.path.join(src, p))]
        app = open(os.path.join(src, "src/App.jsx"), encoding="utf-8").read()
        app_paths = set(re.findall(r'<Route\s+path="([^"]+)"', app)) | ({"/"} if "<Route index" in app else set())
        if app_paths != set(pats):
            probs.append("routes.json patterns != src/App.jsx routes: only in App %s, only in routes.json %s" % (sorted(app_paths - set(pats)), sorted(set(pats) - app_paths)))
        for rid, r in roles.items():
            for p in r.get("paths", []):
                if not os.path.isfile(os.path.join(src, "public", p.lstrip("/"))):
                    probs.append("asset role %s path missing under public/: %s" % (rid, p))
        pkg = json.load(open(os.path.join(src, "package.json"), encoding="utf-8"))
        deps = dict(pkg.get("dependencies", {}), **pkg.get("devDependencies", {}))
        for k, v in manifest.get("sourceProject", {}).get("dependencies", {}).items():
            if deps.get(k) != v:
                probs.append("manifest sourceProject.dependencies.%s = %s but package.json has %s" % (k, v, deps.get(k)))
        R.check("SOURCE_DRIFT", probs)

    return finish(R, quiet)


def finish(R, quiet):
    for name in R.ok:
        if not quiet:
            print("PASS  %s" % name)
    for name, probs in R.warn:
        print("WARN  %s" % name)
        for p in probs[:20]:
            print("        - %s" % p)
    for name, probs in R.fail:
        print("FAIL  %s" % name)
        for p in probs[:20]:
            print("        - %s" % p)
        if len(probs) > 20:
            print("        ... %d more" % (len(probs) - 20))
    print("verify_all: %d passed, %d warned, %d failed" % (len(R.ok), len(R.warn), len(R.fail)))
    return 1 if R.fail else 0


if __name__ == "__main__":
    sys.exit(main())
