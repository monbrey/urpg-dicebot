const mongoose = require('mongoose')
const logger = require('heroku-logger')
const urpgbot = require('./controllers/urpgbot.js')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || urpgbot.config.MONGODB_URI, { useMongoClient: true })
const db = mongoose.connection

db.on('connected', () => {
    logger.info(`Mongoose default connection open`)
})
db.on('error', (err) => {
    logger.error(`Mongoose default connection error: ${err}`)
})
db.on('disconnected', () => {
    console.warn(`Mongoose default connection disconnected`)
})

process.on('SIGINT', function() {
    db.close(function () {
        logger.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    logger.error(JSON.stringify(err))
});

urpgbot.on('ready', () => {
    urpgbot.init()
})

db.once('open', () => {
    try {
        urpgbot.login(process.env.DISCORD_TOKEN || urpgbot.config.DISCORD_TOKEN).then(() => {
            urpgbot.fetchUser(urpgbot.config.ownerID).then((user) => {
                user.send("URPG Dicebot started")
            })
        })
    }
    catch(e) {
        logger.error(`Unable to login to Discord: ${e.message}`)
    }
})