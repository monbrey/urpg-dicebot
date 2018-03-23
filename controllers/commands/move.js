const mongoose = require('mongoose')
const Move = require('../models/move')

generateSingle = (r) => {
    embed = { 
        title: `${r.moveName}`,
        description: `
| Type: ${r.moveType} | Power: ${r.power ? r.power : '-'} | Accuracy: ${r.accuracy ? r.accuracy : '-'} | Category: ${r.category} |

${r.desc} ${r.contact ? "Makes contact.": ""} ${r.sheerForce ? "Boosted by Sheer Force." : ""} ${r.substitute ? "Bypasses Substitute." : ""} ${r.snatch ? "Can be Snatched." : ""} ${r.magicCoat ? "Can be reflected by Magic Coat." : ""}`,
        fields: [],
        footer: ``
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
    if(r.list.length != 0) {
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

exports.run = (client, message, args) => {
    if(args.length == 0) return

    var search = args.join(' ')
    Move.findOne({ 'moveName': new RegExp(`^${search}$`, 'i') }, (err, result) => {
        if(err) {
            message.channel.send("Unknown error querying the database - let Monbrey know.")
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
                        message.channel.send(generateSingle(result[0]))
                        break
                    default:
                        embed = { title: `${result.length} result(s) found for "${search}"`, fields: [] }
                        result.forEach((r) => {
                            embed.fields.push({
                                name: `**${r.moveName}**`,
                                value: `
| Type: ${r.moveType} | Power: ${r.power ? r.power : '-'} | Accuracy: ${r.accuracy ? r.accuracy : '-'} | Category: ${r.category} |`
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
    })
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "move",
    category: "Game"
}