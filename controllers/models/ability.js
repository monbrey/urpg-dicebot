const mongoose = require('mongoose')

var abilitySchema = new mongoose.Schema({
    abilityName: String,
    desc: String
})

module.exports = mongoose.model('Ability', abilitySchema)