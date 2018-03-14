const logger = require('heroku-logger')
const mongoose = require('mongoose')
const Battler = require('../models/battler')
const elo = require('elo-rating')

exports.run = (client, message, args) => {
    const flags = message.flags

    console.log(flags)
    
    var winner = args[0]
    var loser = args[1]

    //Get each of the battlers from Mongoose
    var promises = [
        Battler.findOne({discord_id: winner.id}, (err, result) => {
            if(err) {
                logger.error(err)
                return
            }
            if(result) {
                winner = result
            }
            else {
                winner = new Battler({
                    discord_id: winner.id,
                    username: winner.username
                }).save((err) => {
                    if(err) return
                })
            }
        }),
        Battler.findOne({ discord_id: loser.id }, (err, result) => {
            if(err) {
                logger.error(err)
                return
            }
            if(result) {
                loser = result
            }
            else {
                loser = new Battler({
                    discord_id: loser.id,
                    username: loser.username
                })
                loser.save((err, battler) => {
                    if(err) {
                        console.log(err)
                        return
                    }
                })
            }
        })
    ]

    Promise.all(promises).then(() => {
        expectedRating = elo.expected(winner.currentRating, loser.currentRating)
        new_elo = elo.calculate(winner.currentRating, loser.currentRating, true, 32)
        winner.currentRating = new_elo.playerRating
        winner.higherRating = winner.currentRating > winner.highestRating ? winner.currentRating : winner.highestRating
        loser.currentRating = new_elo.opponentRating
        
        winner.save((err, winner) => {
            if(err) console.log(err)
            message.channel.send(`**${winner.username}**: ${winner.currentRating}`)
            loser.save((err, loser) => {
                if(err) console.log(err)
                message.channel.send(`**${loser.username}**: ${loser.currentRating}`)
            })
        })
    })
}

exports.conf = {
    enabled: false
}

exports.help = {
    name: "elo",
    category: "Game",
    description: "Updates the ELO of two mentioned users. Adds new users if required",
    usage: "!elo @winner @loser"
}