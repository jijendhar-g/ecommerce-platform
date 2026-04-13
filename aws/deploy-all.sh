#!/usr/bin/env bash
# ============================================================
# deploy-all.sh - Deploy the complete full-stack application
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "${SCRIPT_DIR}")"

echo "======================================================"
echo "  E-Commerce Platform - Full Stack Deployment"
echo "======================================================"

# Deploy backend
echo ""
echo "📌 Step 1/2: Deploying Backend..."
cd "${ROOT_DIR}"
bash aws/deploy-backend.sh "${1:-latest}"

# Deploy frontend
echo ""
echo "📌 Step 2/2: Deploying Frontend..."
bash aws/deploy-frontend.sh

echo ""
echo "======================================================"
echo "  ✅ Full stack deployment complete!"
echo "======================================================"
