const mongoose = require('mongoose')
const Schema = mongoose.Schema

var pingUserSchema = new Schema({
    discord_id: { type: String, required: true, unique: true },
    username: { type: String, required: true }
})

module.exports = mongoose.model('PingUser', pingUserSchema)