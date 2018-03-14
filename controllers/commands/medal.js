const jimp = require('jimp')
const discord = require('discord.js')

exports.run = (client, message, args) => {
    console.log(message.guild.id)
    console.log(message.channel.id)
    if(message.guild.id == 135864828240592896 && message.channel.id != 409818526313086976) return

    const flags = message.flags
    console.log(flags)

    if(args[0][0] == '<') {
        args[0] = args[0].substring(1, args[0].length-1)
    }
    jimp.read("./resources/coin.png", (err, coin) => {
        if(err) {
            console.error(err)
            return
        }
        jimp.read(args[0], (err, feature) => {
            if(err) {
                console.error(err)
                return
            }

            feature.resize(128,128).color([
                { apply: 'mix', params: ['#d49000',50] },
                { apply: 'blue', params: [-255] },
                { apply: 'red', params: [50] },
            ])
            coin.composite(feature,0,0)

            if(flags.indexOf('s') > -1) {
                sCoin = coin.clone()
                sCoin.resize(32,32).write("./temp/small.png", () => {
                    message.channel.send({
                        file: "./temp/small.png"
                    })
                })
            }
            if(flags.indexOf('m') > -1) {
                mCoin = coin.clone()
                mCoin.resize(64,64).write("./temp/medium.png", () => {
                    message.channel.send({
                        file: "./temp/medium.png"
                    })
                })
            }
            if(flags.indexOf('l') > -1) {
                lCoin = coin.clone()
                lCoin.write("./temp/large.png", () => {
                    message.channel.send({
                        file: "./temp/large.png"
                    })
                })
            }
        })
        
    })
}

exports.conf = {
    enabled: false
}

exports.help = {
    name: "medal",
    category: "Game"
}