#!/bin/bash
echo "🔧 Building and deploying Dax Collective..."
cd Dax-Main
npm run build
cd ..
firebase deploy --only hosting
echo "✅ Deployment complete!"
