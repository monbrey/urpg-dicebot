const mongoose = require('mongoose')

var pokemonMoveSchema = new mongoose.Schema({
    speciesName: String,
    moveName: String,
    method: String
}, { collection: 'pokemonMoves' })

module.exports = mongoose.model('PokemonMove', pokemonMoveSchema)