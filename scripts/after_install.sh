#!/bin/bash
# Source the .bashrc file to load the environment variables
source /home/ec2-user/.bashrc
cd /home/ec2-user/talkie-backend
sudo rm -rf env-file.zip
sudo rm -rf .env
sudo rm -rf .env.production
aws s3 sync s3://talkieappserver-env-files/production .
unzip env-file.zip
sudo cp .env.production .env
pm2 delete all
yarn install
