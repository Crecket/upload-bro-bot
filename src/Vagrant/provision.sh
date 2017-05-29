#!/bin/bash

    echo -e "Started provisioning..."
        # Set the timezone
        sudo timedatectl set-timezone Europe/Amsterdam
        # Set environment variables (copy leviy.sh to /etc/profile.d)
        sudo echo "mysql-server mysql-server/root_password password root" | sudo debconf-set-selections
        sudo echo "mysql-server mysql-server/root_password_again password root" | sudo debconf-set-selections

    echo -e "Installing packages..."
        # nodejs ppa
        sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
        # mongodb key and list
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
        echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
        # yarn ppa
        curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
        echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

    echo -e "= updating apt-get"
        sudo apt-get update
    echo -e "= installing apt packages"
        sudo apt-get install -y nodejs mysql-server mongodb-org openssl yarn
    echo -e "= installing npm packages"
        sudo yarn global add webpack cross-env pm2 jest nodemon prettier

    echo -e "Starting mongodb"
        sudo service mongod start

    echo -e "Setting up Apache SSL..."
        # SSL files and config
#        sudo mkdir -p /etc/pki
#        sudo mkdir -p /etc/pki/tls
#        sudo mkdir -p /etc/pki/tls/certs
#        sudo mkdir -p /etc/pki/tls/private
#        sudo cp /vagrant/skeleton/Apache/ssl/ca.crt /etc/pki/tls/certs/ca.crt
#        sudo cp /vagrant/skeleton/Apache/ssl/ca.key /etc/pki/tls/private/ca.key

    echo -e "Starting pm2 in dev mode"
        # todo start pm2 correctly
        pm2 start pm2-dev.json
