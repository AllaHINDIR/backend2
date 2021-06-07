
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const regionSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom: {type : String , required:true},
    latitude: {type : Number , required:true}, 
    longitude: {type : Number , required:true} ,

});

regionSchema.plugin(uniqueValidator);

const region = mongoose.model('Region',regionSchema);

module.exports = region;
