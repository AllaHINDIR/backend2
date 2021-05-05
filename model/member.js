
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const memberSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    indicatif : {type : String, required : false, unique : false},
    cin : {type : String, required : false},
    lastName : {type : String, required : true},
    firstName : {type : String, required : true  },
    password : {type : String, required: false},
    email : {type : String , required : false, unique : false},
    phone : {type : String, required : false},
    adresse : {type :String, required : false},
    imagePath : {type : String, required : false},
   
});

memberSchema.plugin(uniqueValidator);
const member = mongoose.model('Member',memberSchema);

module.exports = member;
