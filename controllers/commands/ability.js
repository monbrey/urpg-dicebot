const mongoose = require('mongoose')
const Ability = require('../models/ability')

getAnnouncement = (announce) => {
    switch(announce) {
        case "Active": return "Announced on activation"
        case "Enter": return "Announced on entry"
        case "Hidden": return "Hidden"
        default: return ""
    }
}
exports.run = (client, message, args) => {
    if(args.length == 0) return

    var search = args.join(' ')
    Ability.find({ 'abilityName': new RegExp(search, 'i') }, (err, result) => {
        switch (result.length) {
            case 0:
                message.channel.send(`No results found for ${search}`)
                return
            case 1:
                result = result[0]
                embed = { 
                    title: `${result.abilityName}`,
                    desc: `${result.desc}`, 
                }
                if(result.announcement) {
                    embed.title += ` | ${getAnnouncement(result.announcement)}`
                }
                if(result.affects) {
                    embed.fields.push({
                        name: `**Interacts with the following:**`,
                        value: `${result.affects}`
                    })
                }
                if(result.additional) {
                    embed.footer = {
                        text: result.additional
                    }
                }
                break
            default:
                embed = { 
                    title: `${result.length} result(s) found for "${search}"`, 
                    desc: ``, 
                }
                result.forEach((r) => {
                    embed.desc += r.abilityName+`\n`
                })
                embed.footer = "For more information, search again with one of the listed abilities"
                break
        }

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