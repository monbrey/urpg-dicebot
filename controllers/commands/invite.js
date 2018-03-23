const logger = require('heroku-logger')
var serverRoles = require('../../util/roleMap.js')

exports.run = (client, message, args) => {
    if(message.author_guild._roles.some(r => [serverRoles.moderator.id,serverRoles.official.id].includes(r))) {
        message.channel.createInvite({
            maxAge: 0,
            maxUses: 1,
            unique: true,
            reason: `Generated by ${message.author.username}`
        }).then(invite => {
            message.author.send(`Invite generated: ${invite.url}`)
            logger.info(`${message.author.username} generated an invite link ${invite.url}`,{key:'invite'})
        }).catch(error => {
            logger.error(error, {key:'invite'})
        })
    }
    else {
        message.author.send("Sorry, this command is only available to mods and officials")
    }
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "invite",
    category: "Admin",
    description: "Generate a single use invite link",
    usage: `!invite`
}