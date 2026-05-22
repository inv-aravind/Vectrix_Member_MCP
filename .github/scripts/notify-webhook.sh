#!/usr/bin/env bash
set -euo pipefail

export REPORT_URL="$1"
export EXPIRES_ISO="$2"
export RUN_NUMBER="$3"
export BRANCH_NAME="$4"
export WORKFLOW_NAME="$5"
export JOB_STATUS="$6"
export TEST_COMMAND="${7:-test}"

WEBHOOK_URL="https://chat.googleapis.com/v1/spaces/AAQA_9QXZuY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=h_1boV-U77TZqc79OeYlGSh4yYBL2LNAbdCa1gMIlRQ"
if [ -f .env ]; then
  WEBHOOK_URL=$(grep -E '^WEBHOOK_URL=' .env | cut -d= -f2- | tr -d '\r' || true)
fi

if [ -z "$WEBHOOK_URL" ]; then
  echo "WEBHOOK_URL not set in .env — skipping notification."
  exit 0
fi

payload=$(node <<'NODE'
console.log(JSON.stringify({
  report_url: process.env.REPORT_URL,
  expires_at: process.env.EXPIRES_ISO,
  valid_for_hours: 24,
  run_number: Number(process.env.RUN_NUMBER),
  branch: process.env.BRANCH_NAME,
  workflow: process.env.WORKFLOW_NAME,
  status: process.env.JOB_STATUS,
  test_command: process.env.TEST_COMMAND,
  repository: process.env.GITHUB_REPOSITORY,
  run_url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
}));
NODE
)

curl -sfS -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$payload"

echo "Webhook notification sent."
