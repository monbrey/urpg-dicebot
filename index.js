const mongoose = require('mongoose')
const logger = require('heroku-logger')
const urpgbot = require('./controllers/urpgbot.js')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || "mongodb://monbrey_urpg:m0nbr3y@ds249418.mlab.com:49418/monbrey-urpg", { useMongoClient: true })
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

urpgbot.on('ready', () => {
    urpgbot.init()
})

db.once('open', () => {
    urpgbot.login(process.env.DISCORD_TOKEN).then(() => {
        urpgbot.fetchUser(urpgbot.config.ownerID).then((user) => {
            user.send("URPG Dicebot started")
        })
    })
})