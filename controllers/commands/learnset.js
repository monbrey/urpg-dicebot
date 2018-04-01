const mongoose = require('mongoose')
const logger = require('heroku-logger')
const Species = require('../models/species')
const SpeciesMove = require('../models/speciesMove')

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

exports.run = (client, message, args) => {
    if(args.length == 0) return
    
    confirmSpecies(message, args[0], (response) => {
        method =    message.flags.includes('level') ? 'LEVEL-UP' : 
                    message.flags.includes('TM') ? 'TM' : ''

        searchParam = {'speciesName': response.speciesName }
        if(method != '') searchParam.method = method

        SpeciesMove.find(searchParam).distinct('moveName', (err, result) => {
            if(err) {
                message.channel.send("Unknown error querying the database - let Monbrey know.")
                logger.error(`DB error while searching for ${response.speciesName}`, {key: 'item'})
                return
            }
            if(result) {
                message.channel.send({'embed': {
                    title: `${response.speciesName} can learn ${result.length} moves ${'by '+method || ''}`,
                    description: `${result.sort().join(', ')}`,
                    thumbnail: {
                        url: `https://pokemonurpg.com/img/models/${response.dexNumber}.gif`
                    }
                }})
            }
        })
    })
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "learnset",
    category: "Game",
    shortDesc: "Lookup a Pokemon's learnset from Ultradex",
    description: "Lookup the moves a Pokemon can learn from the Ultradex. Requires an exact name match.",
    usage: `
!learnset -method <pokemon>       Search for moves learned by <pokemon>
                                  Method can be 'level' (I'll add more)`
}