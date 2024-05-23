#!/bin/bash

DIR="/home/ec2-user/talkie-backend"
if [ -d "$DIR" ]; then
  cd /home/ec2-user
  sudo rm -rf talkie-backend
else
  echo "Directory does not exist"
fi
