#!/bin/bash

cd /home/ec2-user/talkie-backend
# Source the .bashrc file to load the environment variables
source /home/ec2-user/.bashrc
echo "Building updated codedeploy version >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
yarn build
yarn start
echo "Application is started >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
