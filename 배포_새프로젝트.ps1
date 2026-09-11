$ErrorActionPreference = "Stop"
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) { npm install -g @railway/cli }
railway login
railway init
railway up
railway domain
