const  Comment =require('../model/Comment.js')
const mongoose = require('mongoose')

module.exports = {
    addComment : function (req,res){
        const id = new mongoose.Types.ObjectId();
        let newComment = new Comment({
            _id:id,
            message : req.body.message,
            creator :req.body.creator,
            topic : req.body.topic
        })
        newComment.save(newComment).then(createdComment => {
            res.status(201).json({
                message: "Comment added successfully",
                createdComment: createdComment
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },

    getCommentsByPost : function (req,res) {
        Comment.find({topic:req.params.idTopic}).then(results=>{
            if(results) res.status(200).json(results);
        }).catch(err=>{
            if(err) res.status(500).send('error : '+err);
        })
    },

    modifyComment : function (req, res) {
        Comment.updateOne({ _id: req.params.idComment},{message:req.body.message}).then(result => {
            if(result.nModified>=0){
                res.status(200).json({ message: "Update successful!" });
            }


        },error=>{
            if(err) res.status(500).send('error : '+err);
        });
    },
    removeComment : function (req,res) {
        Comment.deleteOne({ _id: req.params.idComment}).then(result => {

            if(result.n>0){
                res.status(200).json({ message: "Deletion successful!" });
            }




        });
    },
    countCommentsByPost : function (req,res) {
        Comment.find({topic:req.params.idTopic}).count().then(results=>{
            if(results) res.status(200).json(results);
        }).catch(err=>{
            if(err) res.status(500).send('error : '+err);
        })
    },
}




