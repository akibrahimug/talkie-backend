#!/bin/bash

function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0;}
  echo "$return_"
}

cd /home/ec2-user/talkie-backend
echo "Removing all env files >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo rm -rf env-file.zip
sudo rm -rf .env
sudo rm -rf .env.develop
echo "Downloading fresh envs from s3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo aws s3 sync s3://talkieappserver-env-files/develop .
sudo unzip env-file.zip
sudo cp .env.develop .env
echo "installing NPM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.bashrc
if [ $(program_is_installed yarn) == 0 ]; then
echo "installing YARN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "
npm install --global yarn
fi

if [ $(program_is_installed pm2) == 0 ]; then
echo "installing PM2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
yarn global add pm2
fi
aws s3 sync s3://talkieappserver-env-files/develop .
unzip env-file.zip
cp .env.develop .env
pm2 delete all
sudo chown -R ec2-user:ec2-user /home/ec2-user/talkie-backend
yarn
