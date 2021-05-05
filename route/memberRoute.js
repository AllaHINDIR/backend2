const Member = require('../model/member');
const express = require('express');
const router = express.Router();








router.get('/members', (req,res,next)=>{

    Member.find().sort({inscriptionDate : -1}).then(results=>{
        if(results) res.status(200).json(results);
    }).catch(err=>{
        if(err) res.status(500).send('error : '+err);
    })

})

router.get('/members/:id',(req,res)=>{
    Member.findOne({_id : req.params.id},(err,result)=>{
        if(err) res.status(500).send('error : '+err);
        else if(!result) res.status(404).send(`no member with id ${req.params.id}`);
        else {
            res.status(200).json(result);

        }
    })
})

module.exports = router;