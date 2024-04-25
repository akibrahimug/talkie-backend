#!/bin/bash
function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

if [ $(program_is_installed zip) == 0 ]; then
  apk update
  apk add zip
fi

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
