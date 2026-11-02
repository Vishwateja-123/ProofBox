#!/usr/bin/env bash

# Create clean distribution zip for teammates (excludes node_modules, build artifacts, git)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_ZIP="$PROJECT_ROOT/ProofBox-Team-Distribution.zip"

echo "Packaging ProofBox for team distribution..."
rm -f "$OUTPUT_ZIP"

cd "$PROJECT_ROOT"
zip -r "$OUTPUT_ZIP" . \
  -x "node_modules/*" \
  -x "backend/node_modules/*" \
  -x "frontend/node_modules/*" \
  -x "frontend/dist/*" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "*/.DS_Store" \
  -x "*.log" \
  -x "backend/uploads/*" \
  -x "ProofBox-*.zip"

echo "✅ Clean package created at: $OUTPUT_ZIP"
ls -lh "$OUTPUT_ZIP"

