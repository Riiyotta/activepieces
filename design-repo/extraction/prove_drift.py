#!/usr/bin/env python3
"""Prove verify_all.py's drift checks actually FAIL on drift.

For each case: copy design-repo/ into a fresh temporary directory, inject one
defect, run that copy's verify_all.py, and require a FAIL of the named check.
Then confirm a pristine copy passes. Source-dependent cases (citations, App.jsx
route parity) point the copy at the real source project via
DESIGN_REPO_SOURCE_ROOT; they are reported as SKIPPED when no source tree exists
(standalone delivery), never as passing.

Usage: python3 extraction/prove_drift.py
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, "extraction"))
import verify_all  # noqa: E402

SRC = verify_all.source_root()


def jload(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def jsave(p, d):
    with open(p, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write("\n")


def edit_json(rel, fn):
    def go(root):
        p = os.path.join(root, rel)
        d = jload(p)
        fn(d)
        jsave(p, d)
    return go


def first_citation(d):
    stack = [d]
    while stack:
        x = stack.pop()
        if isinstance(x, dict):
            if set(x) == {"file", "lines", "quote"}:
                return x
            stack.extend(x.values())
        elif isinstance(x, list):
            stack.extend(x)


def phantom_allowlist(d):
    d["sections"]["hero.phantom"] = {"variants": ["default"], "contentFields": [], "mediaSlots": [], "motionPatterns": ["none"]}


def orphan_section(root):
    p = os.path.join(root, "sections", "proof.orphan.json")
    d = jload(os.path.join(root, "sections", "proof.testimonials.json"))
    d["id"] = "proof.orphan"
    jsave(p, d)


def out_of_range(d):
    first_citation(d)["lines"] = "99999"


def wrong_quote(d):
    first_citation(d)["quote"] = "this text appears nowhere in the cited lines"


def write_text(rel, text, append=True):
    def go(root):
        with open(os.path.join(root, rel), "a" if append else "w", encoding="utf-8") as f:
            f.write(text)
    return go


def schema_hand_edit(d):
    d["definitions"]["node"]["allOf"].pop()


def readme_count(root):
    p = os.path.join(root, "README.md")
    s = open(p, encoding="utf-8").read()
    s = s.replace("| sections | ", "| sections | 9", 1)
    open(p, "w", encoding="utf-8").write(s)


CASES = [
    ("phantom allowlist entry", edit_json("tokens/llm/component-allowlist.json", phantom_allowlist), "ALLOWLIST_PARITY", False),
    ("orphan section contract", orphan_section, "ALLOWLIST_PARITY", False),
    ("out-of-range citation", edit_json("sections/hero.home-stage.json", out_of_range), "CITATIONS", True),
    ("in-range citation with wrong content", edit_json("sections/bento.grid.json", wrong_quote), "CITATIONS", True),
    ("manifest count hand-bumped", edit_json("registry.manifest.json", lambda d: d["counts"].update(templates=d["counts"]["templates"] + 1)), "COUNTS_RECOMPUTE", False),
    ("README count wrong", readme_count, "README_COUNTS", False),
    ("allowlistVersion drift", edit_json("registry.manifest.json", lambda d: d.update(allowlistVersion="9.9.9")), "VERSION_PARITY", False),
    ("pinned asset policy changed to another VALID value", edit_json("assets/asset-roles.json", lambda d: d["roles"]["testimonial.avatar"].update(policy="reuse-closed-set")), "ASSET_ROLE_POLICIES", False),
    ("graph rule without validator code", edit_json("compatibility/graph.json", lambda d: d["rules"].append({"id": "NEW_UNIMPLEMENTED", "severity": "error", "description": "x"})), "GRAPH_VALIDATOR_AGREEMENT", False),
    ("graph exception list drifted", edit_json("compatibility/graph.json", lambda d: [r.update(exceptions=[]) for r in d["rules"] if r["id"] == "ONE_HERO"]), "GRAPH_VALIDATOR_AGREEMENT", False),
    ("absolute local path injected", write_text("README.md", "\nSee /" + "Users/someone/project/design-repo\n"), "NO_ABSOLUTE_PATHS", False),
    ("entryPoint outside the package", edit_json("registry.manifest.json", lambda d: d["entryPoints"].append("../src/App.jsx")), "MANIFEST_ENTRYPOINTS", False),
    ("schema hand-edited", edit_json("schema/pagespec.schema.json", schema_hand_edit), "SCHEMA_IN_SYNC", False),
    ("route removed from routes.json", edit_json("templates/routes.json", lambda d: d["routes"].pop(1)), "SOURCE_DRIFT", True),
    ("semantic token broken", edit_json("tokens/10-semantic/semantic.json", lambda d: d["tokens"]["text"]["heading"].update({"$value": "{color.ink.999}"})), "TOKEN_REFERENCES", False),
    ("junk file", write_text(".DS_Store", "x", append=False), "NO_JUNK_FILES", False),
]


def run_copy(mutate, with_source):
    tmp = tempfile.mkdtemp(prefix="drift-")
    try:
        root = os.path.join(tmp, "design-repo")
        shutil.copytree(REPO, root, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store"))
        if mutate:
            mutate(root)
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
        env.pop("DESIGN_REPO_SOURCE_ROOT", None)
        if with_source and SRC:
            env["DESIGN_REPO_SOURCE_ROOT"] = SRC
        p = subprocess.run([sys.executable, os.path.join(root, "extraction", "verify_all.py"), "--quiet"], capture_output=True, text=True, env=env)
        return p.returncode, p.stdout
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    fails = 0
    for label, ws in (("pristine copy, no source sibling", False), ("pristine copy, source via env", True)):
        if ws and not SRC:
            print("SKIPPED  %s (no source tree)" % label)
            continue
        code, out = run_copy(None, ws)
        ok = code == 0
        fails += 0 if ok else 1
        print("%s  %s -> %s" % ("PASS    " if ok else "FAIL    ", label, out.strip().splitlines()[-1]))
    for name, mutate, check, needs_src in CASES:
        if needs_src and not SRC:
            print("SKIPPED  %s (needs source tree)" % name)
            continue
        code, out = run_copy(mutate, needs_src)
        caught = code != 0 and ("FAIL  %s" % check) in out
        fails += 0 if caught else 1
        print("%s  %-52s -> %s" % ("CAUGHT  " if caught else "MISSED! ", name, check if caught else out[-400:]))
    print("prove_drift: %d case(s) + 2 controls, %d failure(s)" % (len(CASES), fails))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
