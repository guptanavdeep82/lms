#!/bin/bash
# Rebuild without serving a half-written .next folder.
# Running `npm run build` while `next start` is live causes CSS/JS 404s.
set -euo pipefail
cd /home/hostingwala/lms
git pull origin main
pm2 stop lms
npm run build
pm2 start lms
pm2 save
