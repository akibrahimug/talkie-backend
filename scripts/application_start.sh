#!/bin/bash

cd /home/ec2-user/talkie-backend
echo "Building updated codedeploy version >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo yarn build
sudo yarn start
echo "Application is started >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
