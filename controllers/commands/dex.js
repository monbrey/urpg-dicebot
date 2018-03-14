const logger = require('heroku-logger')
const request = require('request')

exports.run = (client, message, args) => {
    message.author.send(`Ultradex page for "${args[0]}": https://pokemonurpg.com/pokemon/${args[0]}`)
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "dex",
    category: "Game",
    description: "Retrieve a Pokemon from the Ultradex",
    usage: `
!dex <pokemon>          Get the Ultradex page for <pokemon>`
}