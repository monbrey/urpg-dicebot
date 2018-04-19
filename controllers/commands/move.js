const mongoose = require('mongoose')
const logger = require('heroku-logger')
const Move = require('../models/move')
const Colour = require('../../util/colorMap')

generateSingle = (r) => {
    embed = { 
        title: `${r.moveName}`,
        description: `
| Type: ${r.moveType} | Power: ${r.power ? r.power : '-'} | Accuracy: ${r.accuracy ? r.accuracy : '-'} | PP: ${r.pp} | Category: ${r.category} |

${r.desc} ${r.contact ? "Makes contact. ": ""}${r.sheerForce ? "Boosted by Sheer Force. " : ""}${r.substitute ? "Bypasses Substitute. " : ""}${r.snatch ? "Can be Snatched. " : ""}${r.magicCoat ? "Can be reflected by Magic Coat. " : ""}`,
        fields: [],
        footer: ``,
        color: parseInt(Colour[r.moveType.toLowerCase()], 16)
    }
    if(r.note) {
        embed.footer = {
            "text": r.note
        }
    }
    if(r.additional) {
        embed.fields.push({
            name: "Additional note",
            value: r.additional
        })
    }
    if(r.list && r.list.length != 0) {
        data = ""
        r.list.forEach(l => {
            data += `${l}\n`
        })
        embed.fields.push({
            name: "Helpful data",
            value: data
        })
    }
    if(r.zmove) {
        embed.fields.push({
            name: "Z-Move",
            value: r.zmove
        })
    }
    return embed
}

getRandom = (callback) => {
    invalid = ["After You","Assist","Bestow","Chatter","Copycat","Counter","Covet","Destiny Bond","Detect","Endure","Feint","Focus Punch","Follow Me","Freeze Shock","Helping Hand","Ice Burn","King's Shield","Me First","Metronome","Mimic","Mirror Coat","Mirror Move","Nature Power","Protect","Quash","Quick Guard","Rage Powder","Relic Song","Secret Sword","Sketch","Sleep Talk","Snarl","Snatch","Snore","Spiky Shield","Struggle","Switcheroo","Techno Blast","Thief","Transform","Trick","Wide Guard","V-Create"]

    Move.count().exec((err, count) => {
        randNum = Math.floor(Math.random() * count)

        Move.findOne().skip(randNum).exec((err, result) => {
            console.log(result)
            if(invalid.indexOf(result.moveName) > -1)
                getRandom(callback)
            else
                callback(result)
        })
    })
}

exports.run = (client, message, args) => {
    if(args.length == 0 && message.flags.length == 0) {
        message.channel.send(`\`\`\`Invalid move command
        ${exports.help.usage}\`\`\``)
        return
    }

    random = message.flags.indexOf('m') > -1 ? true : false

    if(random) {
        getRandom(result => {
            message.channel.send({'embed':generateSingle(result)})
        })
        return
    }

    var search = args.join(' ')
    Move.findOne({ 'moveName': new RegExp(`^${search}$`, 'i') }, (err, result) => {
        if(err) {
            message.channel.send("Unknown error querying the database - let Monbrey know.")
            logger.error(`DB eorr when searching for ${search}`, {key: 'move'})
            return
        }
        if(result) {
            message.channel.send({'embed':generateSingle(result)})
        }
        else {
            Move.find({ 'moveName': new RegExp(search, 'i') }, (err, result) => {
                switch (result.length) {
                    case 0:
                        message.channel.send(`No results found for ${search}`)
                        return
                    case 1:
                        message.channel.send({'embed':generateSingle(result[0])})
                        break
                    default:
                        embed = { title: `${result.length} result(s) found for "${search}"`, fields: [] }
                        result.forEach((r) => {
                            embed.fields.push({
                                name: `**${r.moveName}**`,
                                value: `
| Type: ${r.moveType} | Power: ${r.power ? r.power : '-'} | Accuracy: ${r.accuracy ? r.accuracy : '-'} | PP: ${r.pp} | Category: ${r.category} |`
                            })
                        })
                        embed.footer = {
                            "text": "For more information, search again with one of the listed moves"
                        }
                        message.channel.send({'embed': embed})
                        break
                }
            })
        }

        logger.info(`${message.author.username} searched for ${search}`,{key:'move'})
    })
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "move",
    category: "Game",
    shortDesc: "Lookup move data from Refpedia",
    description: "Lookup move data from the Reffing Encylopedia. Will return a list of partial matches, or full data for an exact match.",
    usage: `
!move <search>    Search for move(s) with a match to the
                  <search> parameter
!move -m          Get a random Metronome-compatible move`
}