#!/bin/bash

aws s3 sync s3://talkieappserver-env-files/develop .
# to update and upload the env file to s3
  # zip env-file.zip .env.develop from the root
unzip env-file.zip
cp .env.develop .env
rm .env.develop
# replacing the redis endpoint with ELASTICACHE_ENDPOINT
sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT:6379|g" .env
rm -f env-file.zip
cp .env .env.develop
zip env-file.zip .env.develop
aws --region us-east-1 s3 cp env-file.zip s3://talkieappserver-env-files/develop/
rm -rf .env*
rm -rf env-file.zip
