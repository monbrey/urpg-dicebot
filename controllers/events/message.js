var promises = []

module.exports = (client, message) => {
    if(message.author.bot) return
    message.author_guild = message.guild.members.get(message.author.id)

    const settings = client.config
    message.settings = settings


    if(message.content.indexOf(settings.prefix) !== 0) return

    argsIn = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    argsOut = []

    const command = argsIn.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if(!cmd) return

    message.flags = [];
    argsIn.forEach((arg, index) => {
        //Flags
        if(arg[0] === "-") {
            message.flags.push(arg.substring(1))
            return
        }

        //Mention, get the users object instead
        if(arg.startsWith("<@")) {
            arg = message.guild.members.get(arg.match(/\d+/g).join(''))
        }

        argsOut.push(arg)
    })
    Promise.all(promises).then(() => {
        cmd.run(client, message, argsOut)
    })
}