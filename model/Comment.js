mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    message : {type :String , required : true},
    dateCreation : {type : Date, required:true,default:Date.now},
    creator: {type : mongoose.Schema.Types.ObjectId, ref : "Member", required : true},
    topic:{type : mongoose.Schema.Types.ObjectId, ref : "Topic", required : true},
});
commentSchema.pre(['find','findOne'],function(next) {
  this.populate('creator');
  this.populate('topic');
  next();
})
module.exports = mongoose.model('Comment',commentSchema)
