let mongoose = require('mongoose');
const themeSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type :String , required : true},
    description : {type :String , required : true},
    moderateur :{type : mongoose.Schema.Types.ObjectId, ref : "Member", required : false},
    dateCreation : {type : Date, required:true, default:Date.now},
    forum :{type : mongoose.Schema.Types.ObjectId, ref : "Forum", required : false},
    views :{type : Number ,default: 0, required:true},
    image : {type : String, required : false},
});
/*
themeSchema.pre(['find','findOne'],function (next) {
    this.populate('moderateur');
    this.populate('forum')
    next();
})
*/

module.exports = mongoose.model('Theme',themeSchema)
