const mongoose = require('mongoose')

var moveSchema = new mongoose.Schema({
    moveName: String,
    moveType: String,
    desc: String,
    power: Number,
    accuracy: Number,
    pp: Number,
    category: String,
    contact: Boolean,
    sheerForce: Boolean,
    substitute: Boolean,
    snatch: Boolean,
    magicCoat: Boolean
})

module.exports = mongoose.model('Move', moveSchema)