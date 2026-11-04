#!/usr/bin/env python3
"""Stateless, non-blocking lane reminder; no writes or project checks."""
import json
from pathlib import Path
import subprocess
import sys

try:
    event = json.load(sys.stdin)
    cwd = event.get("cwd") or str(Path.cwd())
    branch = subprocess.run(
        ["git", "-C", cwd, "symbolic-ref", "--quiet", "--short", "HEAD"],
        capture_output=True, text=True, timeout=2,
    )
    if branch.returncode or branch.stdout.strip() != "gitbutler/workspace":
        sys.exit(0)
    message = ("GitButler workspace: inspect but diff before finishing; resolve your task lane "
               "and selectively assign only your owned files/hunks under existing approval gates. "
               "Other dirty changes are not yours. No automatic commits, checks, or repairs.")
    name = event.get("hook_event_name", "")
    if name in ("UserPromptSubmit", "SubagentStart"):
        print(json.dumps({"hookSpecificOutput": {"hookEventName": name,
                                                "additionalContext": message}}))
    elif name in ("Stop", "SubagentStop"):
        print(json.dumps({"systemMessage": message}))
except (ValueError, TypeError, AttributeError, OSError, subprocess.TimeoutExpired):
    pass
