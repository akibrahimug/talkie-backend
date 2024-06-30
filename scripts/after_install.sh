#!/bin/bash

cd /home/ec2-user/talkie-backend
echo "Removing all env files >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo rm -rf env-file.zip
sudo rm -rf .env
sudo rm -rf .env.develop
echo "Downloading fresh envs from s3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo aws s3 sync s3://talkieappserver-env-files/develop .
sudo unzip env-file.zip
sudo cp .env.develop .env
sudo pm2 delete all
# pm2 delete all
echo "Installing app deps >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo yarn
# yarn
