const mongoose = require('mongoose')

var speciesSchema = new mongoose.Schema({
    dexNumber: Number,
    speciesName: String,
    displayName: String,
    formName: String,
    type1: String,
    type2: String,
    hp: Number,
    attack: Number,
    defence: Number,
    specialAttack: Number,
    specialDefence: Number,
    speed: Number,
    height: Number,
    weight: Number,
    gender: { male: Boolean, female: Boolean },
    martPrice: { pokemart: Number, berryStore: Number },
    rank: { story: String, art: String, park: String },
    parkLocation: String
})

module.exports = mongoose.model('Species', speciesSchema)