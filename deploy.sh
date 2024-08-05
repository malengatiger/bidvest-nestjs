#!/bin/bash
echo "\n\n🔵🐦🔵🐦🔵🐦 Deploying Bidvest Backend on NestJS 🔵🐦🔵🐦🔵🐦"
# Define variables
PROJECT_ID="bidvest-33-8eaf4"
IMAGE_NAME="bidvest-backend-image"
REGION="europe-west1"
SERVICE_NAME="bidvest-backend"

echo "\n🐦🐦🐦 Build the app ... 🔵🐦🔵🐦🔵🐦"

npm run build

echo "\n🐦🐦🐦 Build the Docker image ... 🔵🐦🔵🐦🔵🐦"
# Build the Docker image
# docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME .
docker buildx build --platform linux/amd64 -t gcr.io/$PROJECT_ID/$IMAGE_NAME .    

# Push the Docker image to GCR
echo "\n🐦🐦🐦 Push the Docker image ... 🔵🐦🔵🐦🔵🐦"

docker push gcr.io/$PROJECT_ID/$IMAGE_NAME
echo "🍎🍎🍎🍎🍎🍎🍎🍎🍎 start deployment to Cloud Run"

# Deploy the app to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

echo "🍎🍎🍎🍎🍎🍎🍎🍎🍎 Hopefully, we have deployed successfully\n"