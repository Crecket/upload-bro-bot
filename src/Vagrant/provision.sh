#!/bin/bash

    echo -e "Started provisioning..."
        # Set the timezone
        sudo timedatectl set-timezone Europe/Amsterdam

    echo -e "Installing packages..."
        # nodejs ppa
        sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        # mongodb key and ppa
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
        echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
        # yarn ppa
        curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
        echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

    echo -e "= Updating apt"
        sudo apt-get update
    echo -e "= Installing apt packages"
        sudo apt-get install -y nodejs mongodb-org openssl yarn
    echo -e "= Installing npm packages"
        sudo yarn global add webpack cross-env pm2 jest nodemon prettier

    echo -e "Doing initial rsync to upload files to /var/www/upload-bro-bot directory..."
        sudo mkdir -p /var/www/upload-bro-bot
        sudo rsync -a /vagrant/ /var/www/upload-bro-bot/

    echo -e "Starting mongodb..."
        sudo service mongod start
    echo -e "= Enable mongodb on system startup"
        systemctl enable mongod.service
    echo -e "= Importing mongodb dump"
        sudo npm run mongorestore --prefix /var/www/upload-bro-bot

    echo -e "Setting up SSL Certificates..."
        sudo mkdir -p /etc/tls
        sudo cp /vagrant/src/Vagrant/tls/uploadbro.local.dev.crt /etc/tls/uploadbro.local.dev.crt
        sudo cp /vagrant/src/Vagrant/tls/uploadbro.local.dev.key /etc/tls/uploadbro.local.dev.key

    echo -e "Starting pm2 in dev mode..."
        sudo npm run pm2:dev --prefix /var/www/upload-bro-bot
    echo -e "= Running pm2 startup command"
        sudo pm2 startup
