#!/usr/bin/env python3
"""Compose schema/pagespec.schema.json (JSON Schema draft-07) from the contracts.

Sources (all inside design-repo/):
  sections/*.json                  -> section enum, per-section variant/content/media/motion branches
  tokens/00-foundation/motion.json -> motion pattern / trigger / duration / easing enums
  assets/asset-roles.json          -> closed assetRole enum
  templates/templates.json         -> closed template enum

verify_all.py (SCHEMA_IN_SYNC) rebuilds this in memory and fails if the file on
disk differs, so the schema can never silently drift from the contracts.

Usage: python3 schema/build_schema.py            (writes the file)
       python3 schema/build_schema.py --check    (exit 1 if out of sync)
"""
import json
import os
import sys

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGESPEC_VERSION = "1.0.0"
REF_PATTERN = r"^(placeholder:[a-z0-9.-]+|data:[a-z-]+#[A-Za-z0-9._/-]+|generated:[a-z0-9.-]+|/[A-Za-z0-9._/-]+)$"


def _load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def load_sections(repo=REPO):
    out = {}
    d = os.path.join(repo, "sections")
    for name in sorted(os.listdir(d)):
        if name.endswith(".json"):
            with open(os.path.join(d, name), encoding="utf-8") as f:
                s = json.load(f)
            out[s["id"]] = s
    return out


def build(repo=REPO):
    global REPO
    REPO = repo
    sections = load_sections(repo)
    motion = _load("tokens/00-foundation/motion.json")
    roles = _load("assets/asset-roles.json")["roles"]
    templates = _load("templates/templates.json")["templates"]
    patterns = motion["patterns"]
    enums = motion["enums"]

    def opt_enum(key):
        vals = sorted({p[key] for p in patterns.values() if key in p})
        return {"enum": vals}

    defs = {
        "meta": {
            "type": "object", "additionalProperties": False, "required": ["title"],
            "properties": {
                "title": {"type": "string", "minLength": 1, "maxLength": 80, "x-maxWords": 12},
                "description": {"type": "string", "minLength": 1, "maxLength": 200, "x-maxWords": 32},
            },
        },
        "mediaItem": {
            "type": "object", "additionalProperties": False, "required": ["slot", "assetRole", "ref"],
            "properties": {
                "slot": {"type": "string", "pattern": "^[a-zA-Z][a-zA-Z0-9]*$"},
                "assetRole": {"enum": sorted(roles.keys())},
                "ref": {"type": "string", "pattern": REF_PATTERN},
                "alt": {"type": "string", "maxLength": 120},
            },
        },
        "motionEntry": {
            "type": "object", "additionalProperties": False, "required": ["pattern", "trigger", "durationMs", "easing"],
            "properties": {
                "pattern": {"enum": sorted(patterns.keys())},
                "trigger": {"enum": enums["trigger"]},
                "durationMs": {"enum": enums["durationMs"]},
                "easing": {"enum": enums["easing"]},
                "delayMs": opt_enum("delayMs"),
                "staggerMs": opt_enum("staggerMs"),
                "intervalMs": opt_enum("intervalMs"),
            },
        },
        "motion": {
            "type": "object", "additionalProperties": False, "required": ["entries", "reducedMotionFallback"],
            "properties": {
                "entries": {"type": "array", "items": {"$ref": "#/definitions/motionEntry"}},
                "reducedMotionFallback": {"enum": sorted(motion["reducedMotionFallbacks"].keys())},
            },
        },
    }
    branches = []
    for sid, s in sections.items():
        defs["content." + sid] = s["content"]
        slots = sorted(s["media"]["slots"].keys())
        then = {
            "properties": {
                "variant": {"enum": sorted(s["variants"].keys())},
                "content": {"$ref": "#/definitions/content." + sid},
                "media": ({"type": "array", "items": {"properties": {"slot": {"enum": slots}}}} if slots else {"type": "array", "maxItems": 0}),
                "motion": {"properties": {
                    "reducedMotionFallback": {"const": s["motion"]["reducedMotionFallback"]},
                    "entries": {"items": {"properties": {"pattern": {"enum": sorted(s["motion"]["allowedPatterns"])}}}},
                }},
            }
        }
        branches.append({"if": {"properties": {"section": {"const": sid}}, "required": ["section"]}, "then": then})
    defs["node"] = {
        "type": "object", "additionalProperties": False,
        "required": ["id", "section", "variant", "content", "motion"],
        "properties": {
            "id": {"type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$"},
            "section": {"enum": sorted(sections.keys())},
            "variant": {"type": "string"},
            "content": {"type": "object"},
            "media": {"type": "array", "items": {"$ref": "#/definitions/mediaItem"}},
            "motion": {"$ref": "#/definitions/motion"},
        },
        "allOf": branches,
    }
    return {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "https://design-repo.local/activepieces-clone/pagespec.schema.json",
        "title": "Activepieces clone PageSpec",
        "$comment": "GENERATED by schema/build_schema.py from sections/*.json, tokens/00-foundation/motion.json, assets/asset-roles.json and templates/templates.json. Do not hand-edit; verify_all.py SCHEMA_IN_SYNC fails on drift. x-maxWords / x-example are annotation keywords enforced/used by semantic_validate.py.",
        "type": "object", "additionalProperties": False,
        "required": ["pageSpecVersion", "template", "route", "meta", "nodes"],
        "properties": {
            "pageSpecVersion": {"const": PAGESPEC_VERSION},
            "template": {"enum": sorted(templates.keys())},
            "route": {"type": "string", "pattern": "^/[A-Za-z0-9._~%/-]*$"},
            "meta": {"$ref": "#/definitions/meta"},
            "nodes": {"type": "array", "minItems": 1, "items": {"$ref": "#/definitions/node"}},
        },
        "definitions": defs,
    }


def dumps(schema):
    return json.dumps(schema, indent=2, ensure_ascii=False) + "\n"


if __name__ == "__main__":
    target = os.path.join(REPO, "schema", "pagespec.schema.json")
    text = dumps(build(REPO))
    if "--check" in sys.argv:
        with open(target, encoding="utf-8") as f:
            same = f.read() == text
        print("pagespec.schema.json in sync" if same else "pagespec.schema.json OUT OF SYNC")
        sys.exit(0 if same else 1)
    with open(target, "w", encoding="utf-8") as f:
        f.write(text)
    print("wrote schema/pagespec.schema.json")
