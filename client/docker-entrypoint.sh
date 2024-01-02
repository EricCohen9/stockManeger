#!/bin/sh
if [ ! -d "node_modules" ]; then
  echo "Node modules not found. Running npm install..."
  npm install
fi

exec npm run dev

