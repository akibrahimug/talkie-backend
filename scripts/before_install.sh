#!/bin/bash

DIR="/home/ec2-user/talkie-backend"
if [ -d "$DIR" ]; then
  sudo rm -rf "$DIR"
else
  echo "Directory does not exist"
fi
