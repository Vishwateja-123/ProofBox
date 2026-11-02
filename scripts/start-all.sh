#!/usr/bin/env bash

# ==============================================================================
# ProofBox — Full-Stack Application Startup Script (macOS / Apple Silicon)
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=================================================="
echo "🛡️  Starting ProofBox — Warranty & Receipt Vault"
echo "📍 Project Root: $PROJECT_ROOT"
echo "=================================================="

# 1. Verify MongoDB connectivity
echo "[1/3] Checking MongoDB daemon on port 27017..."
if ! nc -z 127.0.0.1 27017 2>/dev/null; then
  echo "⚠️  MongoDB is not running. Attempting to start local mongod..."
  if [ -f /opt/homebrew/etc/mongod.conf ]; then
    mongod --config /opt/homebrew/etc/mongod.conf &
    MONGOD_PID=$!
    sleep 2
  else
    mongod --dbpath "$PROJECT_ROOT/backend/data/db" &
    MONGOD_PID=$!
    sleep 2
  fi
fi

if nc -z 127.0.0.1 27017 2>/dev/null; then
  echo "✅ MongoDB is running and accepting connections."
else
  echo "❌ Error: Could not connect to MongoDB on port 27017."
  exit 1
fi

# Cleanup function on Ctrl+C or kill
cleanup() {
  echo ""
  echo "🛑 Stopping ProofBox servers..."
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null
  fi
  echo "👋 ProofBox shutdown complete."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 2. Start Express Backend
echo "[2/3] Launching Backend API server on http://localhost:5001..."
cd "$PROJECT_ROOT/backend"
npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# 3. Start React / Vite Frontend
echo "[3/3] Launching React Vite frontend on http://localhost:5173..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo "🚀 ProofBox is running locally!"
echo "🌐 Frontend Application: http://localhost:5173"
echo "🔌 Backend REST API:     http://localhost:5001"
echo "🩺 Health Check:         http://localhost:5001/api/health"
echo "👤 Demo Account:         demo@proofbox.com"
echo "🔑 Demo Password:        DemoPassword123!"
echo "=================================================="
echo "Press Ctrl+C to terminate all services."
echo ""

# Keep script running
wait
