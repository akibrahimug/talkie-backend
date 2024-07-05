#!/bin/bash

function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0;}
  echo "$return_"
}
echo "Updating YUM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo yum update -y

echo "Running Code Deploy agent installation >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo yum install ruby -y
sudo yum install wget -y
cd /home/ec2-user/
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto

if [ $(program_is_installed node) == 0 ]; then
echo "Downloading Node >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
## download NodeJS binary (x86 only)
wget -nv https://d3rnber7ry90et.cloudfront.net/linux-x86_64/node-v18.17.1.tar.gz

sudo mkdir /usr/local/lib/node
tar -xf node-v18.17.1.tar.gz
sudo mv node-v18.17.1 /usr/local/lib/node/nodejs
### Unload NVM, use the new node in the path, then install some items globally.
echo "export NVM_DIR=''" >> /home/ec2-user/.bashrc
echo "export NODEJS_HOME=/usr/local/lib/node/nodejs" >> /home/ec2-user/.bashrc
echo "export PATH=\$NODEJS_HOME/bin:\$PATH" >> /home/ec2-user/.bashrc
### Reload environment
. /home/ec2-user/.bashrc
fi

if [ $(program_is_installed git) == 0 ]; then
echo "installing GIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "
sudo yum install git -y
fi

echo "installing YARN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
npm install -g yarn


if [ $(program_is_installed docker) == 0 ]; then
echo "installing DOCKER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
sudo amazon-linux-extras install docker -y
sudo systemctl start docker
sudo docker run --name talkieapp-redis -p 6379:6379 --restart always --detach redis
fi

if [ $(program_is_installed pm2) == 0 ]; then
echo "installing PM2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
yarn global add pm2
fi
cd /home/ec2-user
echo "Cloning repo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
git clone -b develop https://github.com/akibrahimug/talkie-backend.git
echo "Entering project folder >>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
cd talkie-backend
echo "Getting all envs"
aws s3 sync s3://talkieappserver-env-files/develop .
unzip env-file.zip
cp .env.develop .env
echo "Instslling ......................................................................"
yarn install --no-lockfile
echo "Building application >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
yarn build
echo "Starting application >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
yarn start

