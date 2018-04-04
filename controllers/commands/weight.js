const mongoose = require('mongoose')
const logger = require('heroku-logger')
const Species = require('../models/species')

confirmSpecies = (message, speciesName, callback) => {
    Species.findOne({'speciesName': new RegExp(`^${speciesName}$`, 'i')}, (err, result) => {
        if(err) {
            message.channel.send("Unknown error querying the database - let Monbrey know.")
            logger.error(`DB error while searching for ${speciesName}`, {key: 'item'})
            return
        }
        if(!result || result.length == 0) {
            Species.find({'speciesName': new RegExp(speciesName, 'i')}, (err, result) => {
                if(err) {
                    message.channel.send("Unknown error querying the database - let Monbrey know.")
                    logger.error(`DB error while searching for ${speciesName}`, {key: 'item'})
                    return
                }
                if(!result || result.length == 0) {
                    message.channel.send(`Pokemon species "${speciesName}" not found.`)
                    return
                }
                else if(result.length > 1) {
                    speciesNames = []
                    result.forEach(element => {
                        speciesNames.push(element.speciesName)
                    });
                    message.channel.send(`Multiple species found - please search again with an exact term below:
${speciesNames.join('\n')}`)
                }
                else callback(result[0])
            })
        }
        else callback(result)
    })
}

getDamage = (weight) => {
    Number.prototype.between = function(a, b) {
        var min = Math.min.apply(Math, [a, b]), max = Math.max.apply(Math, [a, b]);
        return this >= min && this <= max;
    };

    if(weight.between(0.1, 10)) return 20;
    if(weight.between(10.1, 25)) return 40;
    if(weight.between(25.1, 50)) return 60;
    if(weight.between(50.1, 100)) return 80;
    if(weight.between(100.1, 200)) return 100;
    if(weight > 200.1) return 120;

    return 0;
}

exports.run = (client, message, args) => {
    if(args.length == 0) return
    
    confirmSpecies(message, args[0], (response) => {
        message.channel.send(`${response.speciesName} weighs ${response.weight}kg and weight-based moves have ${getDamage(response.weight)} base power against it`)
    })
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "weight",
    category: "Game",
    shortDesc: "Lookup a Pokemon's weight and damage taken",
    description: "Lookup the weight of a Pokemon. Will also display how much damage the Pokemon will take from weight-based moves.",
    usage: `
!weight <pokemon>       Search for the weight of <pokemon>`
}