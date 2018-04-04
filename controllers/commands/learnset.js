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
        method = []
        message.flags.includes('level') ? method.push('LEVEL-UP') : '' 
        message.flags.includes('tm') ? method.push('TM') : ''
        message.flags.includes('hm') ? method.push('HM') : ''
        message.flags.includes('bm') ? method.push('BREEDING') : ''
        message.flags.includes('mt') ? method.push('MOVE TUTOR') : ''
        message.flags.includes('sm') ? method.push('SPECIAL') : ''

        searchParam = {'speciesName': response.speciesName }
        if(method.length > 0) searchParam.method = { $in: method }

        console.log(message.flags)
        console.log(method)

        SpeciesMove.find(searchParam, (err, result) => {
            if(err) {
                message.channel.send("Unknown error querying the database - let Monbrey know.")
                logger.error(`DB error while searching for ${response.speciesName}`, {key: 'item'})
                return
            }
            if(result) {
                learnset = []
                
                result.forEach((move) => {
                    learnset[move.method] ? learnset[move.method].push(move.moveName) : learnset[move.method] = [move.moveName]
                })

                /* 2000 character splitter I might not need
                for(method in learnset) {
                    learnset[method] = learnset[method].join(', ')
                    if(learnset[method].length > 2000) {
                        splitPoint = learnSet[method].lastIndexOf(', ', 2000)
                        learnset[`${method} (2)`] = learnSet[method].substring(splitPoint)
                        learnset[method] = learnSet[method].substring(0, splitPoint)
                    }
                }
                */
                
                embed = {
                    title: `${response.speciesName} can learn ${result.length} move(s)`,
                    fields: []
                }

                if(method != '') embed.title += ` by ${message.flags.join(', ')}`

                learnset['LEVEL-UP'] ? embed.fields.push({name:'By Level', value: learnset['LEVEL-UP'].sort().join(', ')}) : ''
                learnset['TM'] ? embed.fields.push({name:'By TM', value: learnset['TM'].sort().join(', ')}) : ''
                learnset['HM'] ? embed.fields.push({name:'By HM', value: learnset['HM'].sort().join(', ')}) : ''
                learnset['BREEDING'] ? embed.fields.push({name:'By BM', value: learnset['BREEDING'].sort().join(', ')}) : ''
                learnset['MOVE TUTOR'] ? embed.fields.push({name:'By MT', value: learnset['MOVE TUTOR'].sort().join(', ')}) : ''
                learnset['SPECIAL'] ? embed.fields.push({name:'By SM', value: learnset['SPECIAL'].sort().join(', ')}) : ''

                message.channel.send({'embed': embed})
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
                                  Method can be level, TM, HM, BM, MT or SM`
}