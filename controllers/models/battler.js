const mongoose = require('mongoose')
const Schema = mongoose.Schema

var battlerSchema = new Schema({
    discord_id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    currentRating: { type: Number, required: true, default: 1200 },
    highestRating: { type: Number, required: true, default: 1200 },
    numberOfGamesPlayed: { type: Number, required: true, default: 0 }
})

module.exports = mongoose.model('Battler', battlerSchema)