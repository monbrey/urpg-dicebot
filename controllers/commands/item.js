const mongoose = require('mongoose')
const logger = require('heroku-logger')
const Item = require('../models/item')

searchByType = (message, search) => {
    Item.find({ "correspondingType": new RegExp(`^${search}$`, 'i') }, (err, result) => {
        if(err) {
            message.channel.send("Unknown error querying the database - let Monbrey know.")
            logger.error(`DB error while searching for ${search}`, {key: 'item'})
            return
        }
        if(result) {
            embed = { 
                title: `${result.length} result(s) found for "${search}"`, 
                description: ``,
                fields: []
            }
            result.forEach((r) => {
                embed.fields.push({
                    "name": r.itemName,
                    "value": r.desc
                })
            })
            message.channel.send({'embed':embed})
        }
        else {
            message.channel.send(`No results found corresponding to type: ${search}`)
        }
        logger.info(`${message.author.username} searched for -t ${search}`,{key:'item'})
    })
}

searchByName = (message, search) => {
    Item.findOne({ "itemName": new RegExp(`^${search}$`, 'i') }, (err, result) => {
        if(err) {
            message.channel.send("Unknown error querying the database - let Monbrey know.")
            return
        }
        if(result) {
            embed = { 
                title: `${result.itemName}`,
                description: `${result.desc}`
            }
            message.channel.send({'embed':embed})
            logger.info(`${message.author.username} searched for ${search}`,{key:'item'})
        }
        else {
            Item.find({ 'itemName': new RegExp(search, 'i') }, (err, result) => {
                switch (result.length) {
                    case 0:
                        message.channel.send(`No results found for ${search}`)
                        return
                    case 1:
                        result = result[0]
                        embed = { 
                            title: `${result.itemName}`,
                            description: `${result.desc}`
                        }
                        break
                    default:
                        embed = { 
                            title: `${result.length} result(s) found for "${search}"`, 
                            description: ``, 
                        }
                        result.forEach((r) => {
                            embed.description += r.itemName + (r.correspondingType ? ` | ${r.correspondingType}\n` : '\n')
                        })
                        embed.footer = {
                            "text": "For more information, search again with one of the listed items"
                        }
                        break
                }

                message.channel.send({'embed': embed})
                logger.info(`${message.author.username} searched for ${search}`,{key:'item'})
            })
        }
    })
}

exports.run = (client, message, args) => {
    if(args.length == 0) return
    
    var search = args.join(' ')

    if(message.flags.includes('t'))
        searchByType(message, search)
    else
        searchByName(message, search)
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "item",
    category: "Game",
    shortDesc: "Lookup item data from Refpedia",
    description: "Lookup item data from the Reffing Encylopedia. Will return a list of partial matches, or full data for an exact match.",
    usage: `
!item <search>       Search for ability(s) with a match to
                     the <search> parameter
!item -t <type>      Search for items that interact with
                     certain types`
}