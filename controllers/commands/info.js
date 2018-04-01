const logger = require('heroku-logger')

exports.run = (client, message, args) => {
    if(args.length == 0) {
        return
    }

    if(args.includes('veto')) {
        message.channel.send({'embed': {
            title: 'Veto tiers',
            description: `When multiple effects act on the same Pokemon to prevent the execution of a move, the referee will first check one effect, then the next, and so on. This is the order that is checked. When a move is vetoed from being executed, no other checks are performed.

1. Freeze / Sleep
2. Truant
3. Disable
4. Imprison
5. Heal Block
6. Confuse
7. Flinch
8. Taunt
9. Gravity
10. Attract
11. Paralysis`
        }})
    }
}

exports.conf = {
    enabled: true
}

exports.help = {
    name: "info",
    category: "Game",
    shortDesc: "Get info from Refpedia",
    description: "Pulls subsets of information from the Reffing Encyclopedia",
    usage: `
!info <info>                    Get <info> from Refpedia
Can request:
veto, eot`
}