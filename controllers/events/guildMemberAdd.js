const logger = require('heroku-logger')

module.exports = (client, guildMember) => {
    server = guildMember.guild
    user = guildMember.user

    //user.send(`Welcome to the server! Interested in playing? You'll find everything you need to get started at https://pokemonurpg.com/info/general/getting-started/
//Just here to check it out? That's okay, too! Take your time and explore the game at your own pace.`)

    user.send({"embed": {
        "title": "Getting Started",
        "description": "Welcome to the server! Interested in playing? You'll find everything you need to get started here. Just here to check it out? That's okay, too! Take your time and explore the game at your own pace.",
        "url": "https://pokemonurpg.com/general/getting-starded/",
        "color": 192537,
        "thumbnail": {
          "url": "https://pokemonurpg.com/img/info/general/urpg-logo-large.png"
        },
        "author": {
          "name": "Pokemon URPG",
          "url": "https://discordapp.com",
          "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        "footer": {
          "text": "For a full list of this bot's commands, type !help"
        }
    }});

    logger.info(`${user.username} joined ${server.name}`, {key: 'guildMemberAdd'})
}