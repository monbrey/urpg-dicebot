const mongoose = require('mongoose')

var abilitySchema = new mongoose.Schema({
    abilityName: String,
    announcement: String,
    desc: String,
    additional: String,
    affects: String
})

module.exports = mongoose.model('Ability', abilitySchema)