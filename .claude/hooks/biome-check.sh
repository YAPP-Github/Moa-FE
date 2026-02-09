#!/bin/bash
# PostToolUse hook: Auto-format written/edited files with Biome

FILE_PATH=$(python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)

if [ -n "$FILE_PATH" ] && [ -f "$FILE_PATH" ]; then
  cd "$CLAUDE_PROJECT_DIR" 2>/dev/null
  pnpm exec biome check --write --no-errors-on-unmatched "$FILE_PATH" 2>/dev/null
fi

exit 0
