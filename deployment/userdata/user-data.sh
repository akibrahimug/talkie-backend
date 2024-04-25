#!/bin/bash

function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0;}
  echo "$return_"
}

sudo yum update -y

if [ $(program_is_installed node) == 0 ]; then
### download the NodeJS binary (x86 only)
wget -nv https://d3rnber7ry90et.cloudfront.net/linux-x86_64/node-v18.17.1.tar.gz

sudo mkdir /usr/local/lib/node
tar -xf node-v18.17.1.tar.gz
sudo mv node-v18.17.1 /usr/local/lib/node/nodejs
### Unload NVM, use the new node in the path, then install some items globally.
echo "export NVM_DIR=''" >> /home/ec2-user/.bashrc
echo "export NODEJS_HOME=/usr/local/lib/node/nodejs" >> /home/ec2-user/.bashrc
echo "export PATH=\$NODEJS_HOME/bin:\$PATH" >> /home/ec2-user/.bashrc
npm install -g npm@latest
### Reload environment
. /home/ec2-user/.bashrc

node -e "console.log('Running Node.js ' + process.version)"
fi

if [ $(program_is_installed git) == 0 ]; then
sudo yum install git -y
fi

if [ $(program_is_installed mongodb) == 0 ]; then
npm install mongodb
fi

if [ $(program_is_installed yarn) == 0 ]; then
echo "installing YARN !!!!! "
npm install --global yarn
fi

if [ $(program_is_installed docker) == 0 ]; then
sudo amazon-linux-extras install docker -y
sudo systemctl start docker
sudo docker run --name talkieapp-redis -p 6379:6379 --restart always --detach redis
fi

if [ $(program_is_installed pm2) == 0 ]; then
yarn global add pm2
fi

cd /home/ec2-user

git clone -b develop https://github.com/akibrahimug/talkie-backend.git
cd talkie-backend
yarn
aws s3 sync s3://talkieappserver-env-files/develop .
unzip env-file.zip
cp .env.develop .env
yarn build
yarn start
