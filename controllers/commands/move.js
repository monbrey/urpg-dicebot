const mongoose = require('mongoose')
const Move = require('../models/move')

exports.run = (client, message, args) => {
    if(args.length == 0) return

    var search = args.join(' ')
    Move.find({ 'moveName': new RegExp(search, 'i') }, (err, result) => {
        if(result.length == 0) {
            message.channel.send(`No results found for ${search}`)
            return
        }
        embed = { title: `${result.length} result(s) found for "${search}"`, fields: [] }
        result.forEach((r) => {
            embed.fields.push({
                name: `**${r.moveName}**`,
                value: `
| Type: ${r.moveType} | Power: ${r.power ? r.power : '-'} | Accuracy: ${r.accuracy ? r.accuracy : '-'} | Category: ${r.category} |
${r.desc} ${r.contact ? "Makes contact.": ""} ${r.sheerForce ? "Boosted by Sheer Force." : ""} ${r.substitute ? "Bypasses Substitute." : ""} ${r.snatch ? "Can be Snatched." : ""} ${r.magicCoat ? "Can be reflected by Magic Coat." : ""}`
            })
        })
        message.channel.send({'embed': embed} )
    })
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "move",
    category: "Game"
}