const { format } = require('morgan');

mongoose = require('mongoose');


const topicSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type :String , required : true},
    message : {type :String , required : true},
    dateCreation : {type : Date, required:true,default:Date.now},
    theme:{type : mongoose.Schema.Types.ObjectId, ref : "Theme", required : true},
    creator: {type : mongoose.Schema.Types.ObjectId, ref : "Member", required : true},
    numComments: {type : Number, required : true, default:0 },
    state  : {
      type :  String,
      default : "Accepted",
      enum : ["Accepted","Rejected"],
    } ,
});
topicSchema.pre(['find','findOne'],function(next) {
    this.populate('creator');
    this.populate('theme');
    next();
})


module.exports = mongoose.model('Topic',topicSchema)
