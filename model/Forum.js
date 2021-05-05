mongoose = require('mongoose');

const forumSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type :String , required : true},
    dateCreation : {type : Date, required:true,default:Date.now},
});

module.exports = mongoose.model('Forum',forumSchema)
