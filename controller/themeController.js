const Theme= require('../model/Theme')
const mongoose = require('mongoose')
// const requestIp = require('request-ip')
// var ip = require('ip');
// const publicIp = require('public-ip');
const internalIp = require('internal-ip');
module.exports = {
    addTheme : function (req,res){

        var ipv4 = internalIp.v4.sync();
        //console.log(ipv4);
        const url = req.protocol + "://" + ipv4 + ":5000";
        var imagePath='';
        if (req.file) {
           imagePath = url + "/uploads/images/" + req.file.filename;
        }

        const id = new mongoose.Types.ObjectId();
        let newTheme = new Theme({
            _id:id,
            title : req.body.title,
            description : req.body.description,
            image:imagePath,
            moderateur:req.body.moderateur,
            forum:req.body.forum
        })
        newTheme.save(newTheme).then(createdTheme => {
            res.status(201).json({
                message: "Theme added successfully",
                createdTheme: createdTheme
            });
        });
    },
    getAllThemes : function (req,res){
      Theme.find().sort({dateCreation:-1}).then(results=>{

        // (async () => {
        //     console.log(await internalIp.v4());
        // })();
        if(results) res.status(200).json(results);
      }).catch(err=>{
        if(err) res.status(500).send('error : '+err);
      })
    },
    getThemesByForum : function (req,res){
        Theme.find({forum:req.params.idForum}).sort({dateCreation:-1}).then(results=>{

            if(results) res.status(200).json(results);
        }).catch(err=>{
            if(err) res.status(500).send('error : '+err);
        })
    },
    getThemeById : function (req,res) {
        Theme.findOne({_id : req.params.idTheme},(err,result)=>{
            if(err) res.status(500).send('error : '+err);
            else if(!result) res.status(404).send(`no theme with id ${req.params.idTheme}`);
            else res.json({
                    message : 'theme fetched successfuly',
                    theme : result
                });
        })
    },

    modifyTheme : function (req, res) {
        Theme.updateOne({ _id: req.params.idTheme},req.body).then(result => {
            if(result.nModified>=0){
                res.status(200).json({ message: "Update successful!" });
            }


        },error=>{
            if(err) res.status(500).send('error : '+err);
        });
    },
    removeTheme : function (req,res) {
        Theme.deleteOne({ _id: req.params.idTheme}).then(result => {

            if(result.n>0){
                res.status(200).json({ message: "Deletion successful!" });
            }




        });
    },
    setViews : function (req, res) {
      Theme.updateOne({ _id: req.params.idTheme},{$set :{views: req.body.views +1 }}).then(result => {
        if(result.nModified>=0){
          res.status(200).json({ message: "Update successful!" });
        }


      },error=>{
        if(err) res.status(500).send('error : '+err);
      });
    }
}

