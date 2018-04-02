const mongoose = require('mongoose')

var speciesMoveSchema = new mongoose.Schema({
    speciesName: String,
    moveName: String,
    method: String
})

module.exports = mongoose.model('Species-Move', speciesMoveSchema)