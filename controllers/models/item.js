const mongoose = require('mongoose')

var itemSchema = new mongoose.Schema({
    itemName: String,
    correspondingType: String,
    desc: String
})

module.exports = mongoose.model('Item', itemSchema)