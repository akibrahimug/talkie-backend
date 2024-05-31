#!/bin/bash

cd /home/ec2-user/talkie-backend
sudo chown -R ec2-user:ec2-user /home/ec2-user/talkie-backend
yarn build
yarn start
