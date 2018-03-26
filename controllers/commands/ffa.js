const logger = require('heroku-logger')
const mongoose = require('mongoose')
const PingUser = require('../models/pingUser')

exports.run = (client, message, args) => {
    if(message.flags.length != 1) {
        message.channel.send(`The !ffa command must be run with a single flag:
        \`\`\`${exports.help.usage}\`\`\``)
        return
    }

    object = {
        discord_id: message.author.id,
        username: message.member.nickname || message.author.username
    }

    switch(message.flags[0]) {
        case 'a':
            PingUser.findOneAndUpdate({discord_id: message.author.id}, object, { upsert: true }, (err, result) => {
                if(err) {
                    message.channel.send(`Error adding ${message.author} to the ping list - let Monbrey know.`)
                    return
                }

                if(result)
                    message.channel.send(`${message.author} is already on the ping list`)
                else
                    message.channel.send(`${message.author} added to the ping list`)
            })
            break
        case 'r':
            PingUser.findOneAndRemove({discord_id: message.author.id}, (err, result) => {
                if(err) {
                    message.channel.send(`Database error removing ${message.author} from the ping list - let Monbrey know.`)
                    return
                }

                if(result)
                    message.channel.send(`${message.author} removed from the ping list`)
                else
                    message.channel.send(`${message.author} not found on the ping list`)
            })
            break
        case 'p':
            channel = ['136222872371855360','269634154101080065'].includes(message.channel.id)
            referee = message.member._roles && message.member._roles.includes('243949285438259201')
            if(channel && referee) {
                pingList = ""
                count = 1
                PingUser.find().sort({username:1}).exec((err, list) => {
                    list.forEach((user) => {
                        if(user.discord_id != message.author.id)
                            pingList += "<@"+user.discord_id+">\n"
                        })
                    message.channel.send(`FFA Ping List called by ${message.member.nickname || message.author.username}

Use \`ffa -a\` to add yourself to this list, or \`ffa -r\` to be removed.

${pingList}`)
                })
            }
            else if(!referee) {
                message.author.send("Sorry, that command is restricted to members with the 'referee' role.")
            }
            else if(!channel) {
                message.author.send("The FFA ping command only works in the #ffa chats. Please try again there.")
            }
            break
        default:
            message.channel.send(`The !ffa command must be run with a single flag:
            \`\`\`${exports.help.usage}\`\`\``)
            return
    }
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "ffa",
    category: "Game",
    description: "Add/remove yourself or ping the FFA list",
    usage: `
!ffa -a    Add yourself to the FFA ping list
!ffa -r    Remove yourself from the FFA ping list
!ffa -p    Ping all members on the FFA list
           
Pinging requires the 'referee' role and to be in an #ffa channel`
}