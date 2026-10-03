#!/bin/sh
# Checks a branch name against the rule in AGENTS.md ("Branch names"):
#   <type>/<por-N>-<short-slug>, or <type>/<short-slug> when there is no Linear issue.
# Usage: scripts/check-branch-name.sh [branch]   (defaults to the current branch)
branch="${1:-$(git rev-parse --abbrev-ref HEAD)}"

# `main` is protected by the ruleset; nothing to check.
[ "$branch" = "main" ] && exit 0

types="feat|fix|chore|docs|refactor|test|ci|perf|build|style|revert"
pattern="^($types)/[a-z0-9]+(-[a-z0-9]+)*$"
max=50

if ! printf '%s\n' "$branch" | grep -Eq "$pattern"; then
  echo "Branch \"$branch\" doesn't match <type>/<por-N>-<short-slug> (see AGENTS.md, \"Branch names\")." >&2
  echo "Type is one of: $(echo "$types" | tr '|' ' '). Use lowercase words joined by hyphens." >&2
  echo "Rename it with: git branch -m <new-name>" >&2
  exit 1
fi

if [ "${#branch}" -gt "$max" ]; then
  echo "Branch \"$branch\" is ${#branch} characters; keep it to $max (a short slug, not the full ticket title)." >&2
  exit 1
fi
