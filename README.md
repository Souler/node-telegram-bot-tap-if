# telegram-bot-tap-if
[![https://telegram.me/TapIfBot](https://img.shields.io/badge/TapIfBot.svg)](https://telegram.me/TapIfBot)

This bot keeps count of total and unique tap count on any command that starts
with /TapIf (by default, telegram re-sends to the current chat any command you
tap. Think of it as a simplified version any of the available poll bots.

## Usage
There is currently [a running bot](https://telegram.me/TapIfBot), try it before deploying your own.

## Contributing
First clone 
```
$ git clone git@github.com:Souler/node-telegram-bot-tap-if.git
$ npm install
$ npm start
```

## Deploying

### Openshift v2
First create a gear with the following command:
```
$ rhc app create -a tapifbot \
  -t https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml \
  -t mongodb-2.4 \
  --env NPM_CONFIG_PRODUCTION="true" \
  --env TELEGRAM_BOT_TOKEN="__YOUR_BOT_TOKEN__" \
  --env DATABASE_ADAPTER="mongodb" \
  --env DATABASE_URL="OPENSHIFT_MONGODB_DB_URL" \
  --env DEBUG="tap-if-bot:*" \
  --no-git
$ rhc configure-app -a tapifbot \
  --no-auto-deploy \
  --deployment-type binary
```

Then you can deploy the project by running:
```
$ npm run deploy
```

## License
MIT