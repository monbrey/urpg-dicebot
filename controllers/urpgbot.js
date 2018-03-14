const Discord = require('discord.js')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const Enmap = require('enmap')
const EnmapLevel = require('enmap-level')

var client = new Discord.Client()
client.config = require('../config.js')

client.commands = new Enmap()
client.aliases = new Enmap()

client.loadCommand = (commandName) => {
    try {
        const command = require(`${__dirname}/commands/${commandName}`)
        //client.logger.log(`Loading Command: ${props.help.name}`)

        if (command.init) {
            command.init(client)
        }
        client.commands.set(command.help.name, command)
        if(command.conf.aliases) {
            command.conf.aliases.forEach(alias => {
                client.aliases.set(alias, command.help.name)
            });
        }
        return false
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`
    }
}

client.init = async () => {
    const cmdFiles = await readdir(`${__dirname}/commands/`)
    //client.logger.log(`Loading a total of ${cmdFiles.length} commands.`)
    cmdFiles.forEach(f => {
        if(!f.endsWith('.js')) return
        const response = client.loadCommand(f)
        if (response) console.log(response)
    })

    const evtFiles = await readdir(`${__dirname}/events/`)
    evtFiles.forEach(f => {
        const eventName = f.split('.')[0];
        const event = require(`${__dirname}/events/${f}`)
        client.on(eventName, event.bind(null, client))
        delete require.cache[require.resolve(`${__dirname}/events/${f}`)]
    })
}

module.exports = client