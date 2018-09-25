const mongoose = require('mongoose')

var pokemonSchema = new mongoose.Schema({
	pokemon_id: {
		type: String,
	},
	dexNumber: {
		type: Number,
		required: true
	},
	speciesName: {
		type: String,
		required: true
	},
	displayName: {
		type: String,
		required: true
	},
	formName: {
		type: String
	},
	type1: {
		type: String,
		required: true
	},
	type2: {
		type: String
	},
	hp: {
		type: Number,
		required: true
	},
	attack: {
		type: Number,
		required: true
	},
	defence: {
		type: Number,
		required: true
	},
	specialAttack: {
		type: Number,
		required: true
	},
	specialDefence: {
		type: Number,
		required: true
	},
	speed: {
		type: Number,
		required: true
	},
	height: {
		type: Number
	},
	weight: {
		type: Number
	},
	gender: {
		male: {
			type: Boolean
		},
		female: {
			type: Boolean
		}
	},
	martPrice: {
		pokemart: {
			type: Number
		},
		berryStore: {
			type: Number
		}
	},
	rank: {
		story: {
			type: String
		},
		art: {
			type: String
		},
		park: {
			type: String
		}
	},
	parkLocation: {
		type: String
	},
	starterEligible: {
		type: Boolean,
		required: true
	}
}, { collection: 'pokemon' })

pokemonSchema.statics.findExact = function (speciesName, callback) {
	return this.findOne({
		'speciesName': new RegExp(`^${speciesName}$`, 'i')
	}, callback)
}

pokemonSchema.statics.findPartial = function (speciesName, callback) {
	return this.find({
		'speciesName': new RegExp(speciesName, 'i')
	}, callback)
}

module.exports = mongoose.model('Pokemon', pokemonSchema)
