#!/bin/bash

cd /home/ec2-user/talkie-backend
echo "Building updated codedeploy version >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
yarn build
yarn start
echo "Application is started >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
