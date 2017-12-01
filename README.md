# upload-bro-bot

[![Build Status](https://travis-ci.com/Crecket/upload-bro-bot.svg?token=DyngMrpViVuxsTWmBnCh&branch=master)](https://travis-ci.com/Crecket/upload-bro-bot)

## Installation
1. Run the initial commands to setup the vagrant box and install requirements
```bash
git clone git@github.com:Crecket/upload-bro-bot.git 
cd upload-bro-bot
yarn
cp .env.example .env
npm run build
vagrant up
```
2. Enter the correct keys in the env file for all the providers in the environment file.
3. Setup SFTP to sync your this project folder to the `/var/www/upload-bro-bot` folder on the vagrant box (IP: 192.168.33.10)
4. Add `uploadbro.local.dev` to your hostfile if you don't have [vagrant-hostsupdater](https://github.com/cogitatio/vagrant-hostsupdater) installed
5. Optionally you can trust the ssl certificates in `src/Vagrant/tls` to prevent ssl errors or create your own

## Development
Development is done by running the vagrant box and building the files on your local project folder.

Use the `npm run dev` command to build the client-side files. In develoment mode, the server uses babel-node to compile the files on the fly.

Make sure to run `npm run test:dev` to start Jest in watch mode or `npm run test` to run all tests in verbose mode.

To develop the server-side code use `vagrant ssh` to login to the box, stop the pm2 instance using `pm2 stop upload-bro-bot` and then start a manual server instance with `npm run start`. 

## Scripts

|script| description|
|---|---|
| `start` | run server using babel-node and nodemon |
| `dev` | run webpack for the client in watch mode |
| `dev-sw` | run webpack for the client in watch mode but with service worker in production mode |
| `test` | start a full verbose jest testrun |
| `test:dev` | start jest in watch/development mode |
| `build` | runs both client and server build scripts |
| `build:client` | compiles the client files using webpack in production mode |
| `build:server` | compiles the server and client files to a dist folder using babel |
| `sw` | runs a single production-mode round of the sw-precache plugin |
| `prettify` | runs prettify on all src/client files |
| `pm2` | starts the production server using the pm2 config |
 
