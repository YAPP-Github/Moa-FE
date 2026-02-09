#!/bin/bash
# Stop hook: Run lint check when Claude finishes
# If lint fails, blocks Claude from stopping so it can fix the issues

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null

# Prevent infinite loop: if already retrying from a previous stop hook, allow stop
STOP_HOOK_ACTIVE=$(python3 -c "import sys,json; print(json.load(sys.stdin).get('stop_hook_active', False))" 2>/dev/null)

if [ "$STOP_HOOK_ACTIVE" = "True" ]; then
  exit 0
fi

OUTPUT=$(pnpm run lint 2>&1)
if [ $? -ne 0 ]; then
  echo "$OUTPUT" | tail -30 >&2
  exit 2
fi

exit 0
