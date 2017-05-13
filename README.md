# upload-bro-bot

[![Build Status](https://travis-ci.com/Crecket/upload-bro-bot.svg?token=DyngMrpViVuxsTWmBnCh&branch=master)](https://travis-ci.com/Crecket/upload-bro-bot)

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

 
