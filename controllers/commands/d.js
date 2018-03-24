const logger = require('heroku-logger')

exports.run = (client, message, args) => {
    const verify = message.flags.indexOf('-v') > -1 ? true : false
    const help = message.flags.indexOf('-h') > -1 ? true : false
    
    if(help) {
        message.channel.send(`\`\`\`Dice command usage:
        ${exports.help.usage}\`\`\``)
        return
    }

    if(args.length < 1) {
        message.channel.send(`\`\`\`Invalid dice command
        ${exports.help.usage}\`\`\``)
        return
    }

    var roll = '';
    if(args[0].indexOf(',') < 0) {
        if(!/[1-9]\d*/.test(args[0])) {
            message.channel.send(`\`\`\`Invalid dice command
            ${exports.help.usage}\`\`\``)
            return
        }
        roll = Math.floor((Math.random() * args[0]) +1)
    }
    else {
        var [dice,sides] = args[0].split(',')
        if(!/[1-9]\d*/.test(dice) || !/[1-9]\d*/.test(sides)) {
            message.channel.send(`\`\`\`Invalid dice command
            ${exports.help.usage}\`\`\``)
            return
        }
        var rolls = []
        for(i = 0; i < dice; i++) {
            rolls.push(Math.floor((Math.random() * sides) +1))
        }
        roll = rolls.join(', ')
    }

    var response = verify ? `${message.author.username} rolled ${roll}: verification ID #${Date.now()}` : `${message.author.username} rolled ${roll}`
    message.channel.send(response)

    var log = `${Date.now()} - ${message.author.username} rolled ${roll} in ${message.guild.name}:${message.channel.name}`
    logger.info(log,{key:'dice'})
}

exports.conf = {
    enabled: true,
    aliases: ['dice','roll-dice']
}

exports.help = {
    name: "d",
    category: "Game",
    shortDesc: "Roll one or more die",
    description: "Rolls an x-sided dice, or y-number of x-sided dice",
    usage: `
!d [x]                          Roll one [x] sided die
!d [y],[x]                      Roll [y] [x] sided dice
!d -v [x] | !d -v [y],[x]       Roll with verification ID

All variables will only accept positive integers`
}