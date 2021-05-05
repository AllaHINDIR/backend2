const Topic= require('../model/topic')
const Comment = require('../model/Comment')
const mongoose = require('mongoose')

module.exports = {
    addTopic: function(req,res){
        const id = new mongoose.Types.ObjectId();
        let newTopic = new Topic({
            _id:id,
            title : req.body.title,
            message : req.body.message,
            creator: req.body.creator,
            theme:req.body.theme
        })
        newTopic.save(newTopic).then(createdTopic => {
            res.status(201).json({
                message: "Topic added successfully",
                createdTopic: createdTopic
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getTopics : function(req,res){
        
        Topic.find().sort({dateCreation:-1}).then(results=>{

            if(results) res.status(200).json(results);
            //console.log(results);
        }).catch(err=>{
            if(err) res.status(500).send('error : '+err);
        })
    },
    getTopicsByTheme:function(req,res){
        Topic.find({theme:req.params.idTheme}).sort({dateCreation:-1}).then(results=>{
            if(results) res.status(200).json(results);
        }).catch(err=>{
            if(err) res.status(500).send('error : '+err);
        })
    },
    getTopicById : function (req,res) {
        Topic.findOne({_id : req.params.idTopic},(err,result)=>{
            if(err) res.status(500).send('error : '+err);
            else if(!result) res.status(404).send(`no Topic with id ${req.params.idTopic}`);
            else res.json({
                    message : 'Topic fetched successfuly',
                    Topic : result
                });
        })
    },
    removeTopic : function(req,res){
        Topic.deleteOne({ _id: req.params.idTopic}).then(result => {

            if(result.n>0){
                Comment.deleteMany({topic: req.params.idTopic}).then(result =>{
                    if(result.n>0){
                        console.log("les reponse sont supprimées aussi")
                    }
                });
                res.status(200).json({ message: "Deletion successful!" });
            }
        });

    },

    modifyTopic : function(req, res){
        Topic.updateOne({ _id: req.params.idTopic},{title: req.body.title,message:req.body.message}).then(result => {
            if(result.nModified>=0){
                res.status(200).json({ message: "Update successful!" });
            }

        },error=>{
            if(err) res.status(500).send('error : '+err);
        });
    },
    changeState :function(req, res){
      Topic.updateOne({ _id: req.params.idTopic},{state:req.params.state}).then(result => {
        if(result.nModified>=0){
          res.status(200).json({ message: "Update successful!" });
        }


      },error=>{
        if(err) res.status(500).send('error : '+err);
      });
    },
    addComment : function(req, res){
        Topic.updateOne({ _id: req.params.idTopic }, { $inc: { numComments: 1 } }).then(result => {
            if (result.nModified >= 0) {
                res.status(200).json({ message: "Comment num added" });
            }
        }, error => {
            if (err) res.status(500).send('error : ' + err);
        });
    },
    deleteComment : function (req, res) {
        Topic.updateOne({ _id: req.params.idTopic }, { $inc: { numComments: -1 } }).then(result => {
            if (result.nModified >= 0) {
                res.status(200).json({ message: "Comment num added" });
            }
        }, error => {
            if (err) res.status(500).send('error : ' + err);
        });
    }
}

