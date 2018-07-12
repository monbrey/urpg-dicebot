const fs = require('fs')
const logger = require('heroku-logger')

var roleMap = require('../../util/roleMap.js')
var roleList = []

for(key in roleMap) {
    if(roleMap[key].hasOwnProperty("id")) roleList.push(key)
}

exports.run = (client, message, args) => {
    const flags = message.flags
    const list = flags.indexOf('l') > -1 ? true : false
    const remove = flags.indexOf('r') > -1 ? true : false
    const help = flags.indexOf('h') > -1 ? true : false

    if(!message.guild || message.guild.name != "URPG")
        return
        
    if(list) {
        message.channel.send(`Role names accepted: ${roleList.join(", ")}`)
        return
    }

    if(help) {
        message.channel.send(`\`\`\`Role command usage:
        ${exports.help.usage}\`\`\``)
    }

    //Assign the variables from the arguments
    var role = roleMap[args[0]]
    var assignee = args[1]
    var invoker = message.member

    //Error checks 
    if(args.length != 2) {
        message.channel.send("Invalid role assignment command")
        return
    }

    if(!role.hasOwnProperty("id")) {
        message.channel.send(`Role "${args[0]}" is not yet configured to be assigned. For a list of roles, type "!role -l".`)
        return
    }

    if(!role) {
        message.channel.send(`Role "${args[0]}" not found. For a list of roles, type "!role -l".`)
        return
    }

    if(!assignee) {
        message.channel.send(`Invalid assignee. Second parameter must mention a user.`)
        return
    }

    //Permission check
    var permission = invoker._roles.some(r => role.assigners.includes(r))

    if(permission) {
        if(remove) {
            assignee.removeRole(role.id, `Role removed by ${message.member.nickname || message.author.username}`)
            .then(() => {
                message.channel.send(`Role "${args[0]}" removed from ${assignee.nickname || assignee.user.username}`)
                logger.info(`${message.member.nickname || message.author.username} removed ${args[0]} from ${assignee.nickname || assignee.user.username}`)
            })
            .catch((err) => { 
                if(err.message == "Missing Permissions") {
                    message.channel.send(`This bots role in this server does not allow it to assign ${args[0]}.`) 
                }
                else {
                    message.channel.send(`Unknown error assigning role.`) 
                }
            })
        }
        else {
            assignee.addRole(role.id, `Role applied by ${message.member.nickname || message.author.username}`)
            .then(() => {
                message.channel.send(`Role "${args[0]}" given to ${assignee.nickname || assignee.user.username}`)
                logger.info(`${message.member.nickname || message.author.username} gave ${args[0]} to ${assignee.nickname || assignee.user.username}`)
            })
            .catch((err) => { 
                if(err.message == "Missing Permissions") {
                    message.channel.send(`This bots role in this server does not allow it to assign "${args[0]}".`) 
                }
                else {
                    message.channel.send(`Unknown error assigning role.`) 
                }
            })
        }
    }
    else {
        message.channel.send(`None of your roles have permission to assign "${args[0]}".`)
    }
}

exports.init = (client) => {
    serverRoles = client.guilds.find('name', 'URPG').roles
    unmappedRoles = []

    serverRoles.forEach(sRole => {
        if(!Object.keys(roleMap).includes(sRole.name))
            unmappedRoles.push(sRole.name)
    })

    if(unmappedRoles.length > 0)
        logger.info(`Unmapped roles detected: ${unmappedRoles.join(', ')}`, {key:"role"})
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "role",
    category: "Admin",
    shortDesc: "Assign a URPG server role to a user",
    description: "Assign a Discord role to a user (requires permission)",
    usage: `
!role <role> @user          Assign <role> to @user
!role -r <role> @user       Remove <role> from @user
!role -l                    List roles that can be assigned`
}