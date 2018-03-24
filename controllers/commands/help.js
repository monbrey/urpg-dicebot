exports.run = (client, message, args) => {
    embed = {
        title: "URPG Dicebot",
        description: `URPG's dice and general gamebot developed by Monbrey.
Source code available on [Github](https://github.com/monbrey/urpg-dicebot.git).
Any issues or feature requests, DM Monbrey or open an issue on the Github.`,
        fields: []
    }

    commandBlock = ""
    client.commands.forEach(c => {
        if(c.conf.enabled)
            commandBlock += `!${c.help.name}${" ".repeat(12-c.help.name.length)}${c.help.shortDesc || c.help.description}\n`
    })

    embed.fields.push({
        name: "Commands:",
        value: `\`\`\`${commandBlock}\`\`\``
    })

    embed.footer = {
        text: "Commands have detailed help output accessible via !command -h"
    }

    message.channel.send({'embed':embed})
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "help",
    category: "General",
    shortDesc: "Displays help output",
    description: "Displays help output.\nIf you need help using the help command, you're probably beyond help.",
    usage: `!help`
}

