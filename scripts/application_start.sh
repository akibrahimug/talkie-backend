#!/bin/bash

cd /home/ec2-user/talkie-backend
echo "installing NPM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.bashrc
if [ $(program_is_installed yarn) == 0 ]; then
  echo "installing YARN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "
  npm install --global yarn
fi
sudo chown -R ec2-user:ec2-user /home/ec2-user/talkie-backend
yarn build
nohup yarn start &

echo "Application is started in the background."
