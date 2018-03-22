const mongoose = require('mongoose')
const Ability = require('../models/ability')

exports.run = (client, message, args) => {
    if(args.length == 0) return

    var search = args.join(' ')
    Ability.find({ 'abilityName': new RegExp(search, 'i') }, (err, result) => {
        if(result.length == 0) {
            message.channel.send(`No results found for ${search}`)
            return
        }
        embed = { title: `${result.length} result(s) found for "${search}"`, fields: [] }
        result.forEach((r) => {
            embed.fields.push({
                name: `**${r.abilityName}**`,
                value: `
|${r.announcement}|
${r.desc}
Note: ${r.additional}`
            })
        })
        message.channel.send({'embed': embed} )
    })
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "ability",
    category: "Game"
}