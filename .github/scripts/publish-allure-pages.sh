#!/usr/bin/env bash
set -euo pipefail

RUN_NUMBER="$1"
BRANCH_SLUG="$2"
BRANCH_NAME="$3"
REPO="$4"
ALLURE_DIR="${5:-allure-report}"
OUTPUT_FILE="${6:-$GITHUB_OUTPUT}"

REPORT_ID="${RUN_NUMBER}-${BRANCH_SLUG}"
PAGES_ROOT="gh-pages-content"
REPORTS_DIR="${PAGES_ROOT}/reports"
REPORT_PATH="${REPORTS_DIR}/${REPORT_ID}"
NOW=$(date +%s)
EXPIRES_AT=$((NOW + 86400))
EXPIRES_ISO=$(date -u -d "@${EXPIRES_AT}" +%Y-%m-%dT%H:%M:%SZ)
REPO_URL="https://github.com/${REPO}.git"

if [ -n "${GITHUB_TOKEN:-}" ]; then
  REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git"
fi

rm -rf "$PAGES_ROOT"
mkdir -p "$REPORTS_DIR"

if git ls-remote --heads "$REPO_URL" gh-pages | grep -q gh-pages; then
  git clone --quiet --depth 1 --branch gh-pages "$REPO_URL" existing-gh-pages
  if [ -d existing-gh-pages/reports ]; then
    find existing-gh-pages/reports -mindepth 1 -maxdepth 1 -type d | while read -r dir; do
      expiry_file="${dir}/expiry.json"
      if [ -f "$expiry_file" ]; then
        expires=$(node -pe "JSON.parse(require('fs').readFileSync('${expiry_file}','utf8')).expires_at")
        if [ "$NOW" -gt "$expires" ]; then
          echo "Removing expired report: $(basename "$dir")"
          continue
        fi
        cp -r "$dir" "$REPORTS_DIR/$(basename "$dir")"
      fi
    done
  fi
  rm -rf existing-gh-pages
fi

mkdir -p "$REPORT_PATH"

if [ -d "$ALLURE_DIR" ] && [ -n "$(ls -A "$ALLURE_DIR" 2>/dev/null || true)" ]; then
  cp -r "$ALLURE_DIR"/. "$REPORT_PATH/"
else
  echo "Allure report directory is missing or empty; skipping page content copy."
fi

cp .github/allure-pages/expiry-check.js "$REPORT_PATH/expiry-check.js"

cat > "$REPORT_PATH/expiry.json" <<EOF
{
  "expires_at": ${EXPIRES_AT},
  "expires_at_iso": "${EXPIRES_ISO}",
  "run_number": ${RUN_NUMBER},
  "branch": "${BRANCH_NAME}",
  "report_id": "${REPORT_ID}"
}
EOF

if [ -f "$REPORT_PATH/index.html" ]; then
  sed -i 's|<head>|<head><script src="expiry-check.js"></script>|' "$REPORT_PATH/index.html"
fi

REPO_NAME="${REPO#*/}"
REPORT_URL="https://${REPO%%/*}.github.io/${REPO_NAME}/reports/${REPORT_ID}/index.html"

{
  echo "report_url=${REPORT_URL}"
  echo "expires_at_iso=${EXPIRES_ISO}"
  echo "report_id=${REPORT_ID}"
} >> "$OUTPUT_FILE"

echo "Allure report URL: ${REPORT_URL}"
echo "Expires at: ${EXPIRES_ISO} UTC"
