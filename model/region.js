
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const regionSchema = mongoose.Schema({

    nom: {type : String , required:true}

});

regionSchema.plugin(uniqueValidator);

const region = mongoose.model('Region',regionSchema);

module.exports = region;
