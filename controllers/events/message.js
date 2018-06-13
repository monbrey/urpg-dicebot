const help = require('../../util/getHelp.js')
const logger = require('heroku-logger')


module.exports = (client, message) => {
    if(message.author.bot) return

    const settings = client.config
    message.settings = settings

    if(message.content.indexOf(settings.prefix) !== 0) return

    var location = message.guild ? `${message.guild.name}:${message.channel.name}` :  "DM"
    logger.info(`${message.author.username} in ${location} - ${message.content}`)
    
    argsIn = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    argsOut = []

    const command = argsIn.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if(!cmd) return

    message.flags = [];
    argsIn.forEach((arg, index) => {
        //Flags
        if(arg[0] === "-") {
            message.flags.push(arg.substring(1).toLowerCase())
            return
        }

        //Mention, get the users object instead
        if(arg.startsWith("<@") && message.guild) {
            arg = message.guild.members.get(arg.match(/\d+/g).join(''))
        }

        argsOut.push(arg)
    })

    //Single point of call for all help commands
    if(message.flags.includes('h')) {
        message.channel.send({'embed':help.output(cmd.help, cmd.conf.aliases)})
    }
    else {
        logger.info(`Running command`)
        cmd.run(client, message, argsOut)
    }
}