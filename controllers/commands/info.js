const logger = require('heroku-logger')

exports.run = (client, message, args) => {
    if(args.length == 0) {
        return
    }

    if(args.includes('veto')) {
        message.channel.send({'embed': {
            title: 'Veto Tiers',
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

    if(args.includes('eot')) {
        message.channel.send({'embed': {
            title: 'End of Turn Effects',
            description: `There are many moves and effects that can occur at the end of the turn. The order they occur is listed in the following quote. The numbers indicate the overall order of the effects. All effects that start with 21. occur for the faster Pokemon, and then they occur for the slower Pokemon. For example, a Jolteon's Reflect would wear off, then its Tailwind would wear off, and then a Slowpoke's Reflect would wear off, and then its Tailwind would wear off if they were to end on the same turns.

1. Grassy Terrain heals
2. Weather/Terrain Ends
3. Sandstorm damage, Hail damage, Rain Dish, Dry Skin, Solar Power, Ice Body
4. Future Sight, Doom Desire
5. Wish
    5.1. Fire Pledge + Grass Pledge damage
    5.2. Shed Skin, Hydration, Healer
    5.3. Leftovers, Black Sludge
6. Aqua Ring
7. Ingrain
8. Leech Seed
9. Poison damage, Burn damage, Nightmare, Poison Heal
10. Curse (from a Ghost-type)
11. Bind, Wrap, Fire Spin, Clamp, Whirlpool, Sand Tomb, Magma Storm, Infestation
12. Taunt ends
13. Encore ends
14. Disable ends, Cursed Body ends
15. Magnet Rise ends
16. Telekinesis ends
17. Heal Block ends
18. Embargo ends
19. Yawn
20. Perish Song
    20.1. Reflect ends
    20.2. Light Screen ends
    20.3. Safeguard ends
    20.4. Mist ends
    20.5. Tailwind ends
    20.6. Lucky Chant ends
    20.7. Water/Fire/Grass Pledge
21. Gravity ends
22. Trick Room ends
23. Wonder Room ends
24. Magic Room ends
    24.1. Uproar message
    24.2. Speed Boost, Bad Dreams, Harvest, Moody
    24.3. Toxic Orb activation, Flame Orb activation, Sticky Barb
25. Shields Down, Zen Mode
26. Pokémon is switched in (if previous Pokémon fainted)
    26.1. Healing Wish, Lunar Dance
    26.2. Spikes, Toxic Spikes, Stealth Rock, Sticky Web`
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