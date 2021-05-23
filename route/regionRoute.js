const express = require("express");

const Region = require("../model/region");
const Member = require('../model/member');
const router = express.Router();
//const checkAuth = require('../middleware/check-auth');


/*router.post("/regions", checkAuth,(req, res, next) => {


    const region = new Region({
        nom: req.body.nom

    })
    region.save().then(createdRegion => {
        res.status(201).json({
            message: "Region added successfully",
            regionId: createdRegion._id
        });
    });
});*/
router.get("/regions", (req, res, next) => {
    Region.find().then(documents => {
        res.status(200).json({
            message: "Regions fetched successfully!",
            regions: documents
        })
    }) .catch(err=>{
            res.status(500).json({
                err: err
            })
        });

});

/*
router.get("/regionsMembers", (req, res, next) => {
    let fitchedRegions = [] ;
    Region.find().then(regions => {
        fitchedRegions = regions;
        regions.forEach(region=>{
            let transformedRegion = null;
            Member.findOne({_regionId : region._id, state : "Accepted"}).then(result=>{

                if(!result) {
                       fitchedRegions.splice(1, fitchedRegions.findIndex(elt=>{elt._id==region._id}))
                    }

            })

        })

        res.status(200).json({
            message: "Regions fetched successfully!",
            regions: fitchedRegions
        });
    }).catch(err=>{
        res.status(500).json({
            err : err
        })
    })

});
router.get('/regions/:id',(req,res)=> {
    Region.findOne({_id: req.params.id}, (err, document) => {
        if (err) res.status(500).send(err);
        else if (!document) res.status(404).send(`region with id ${req.params.id} not found`)
        else {
            res.status(200).json({
                message: 'region fitched successfully',
                region: document
            })
        }
    })
})
router.put("/regions/:id", checkAuth,(req, res) => {

  const region = new Region({
    _id : req.params.id,
    nom : req.body.nom
  })

  Region.updateOne({ _id: req.params.id},region).then(result => {
    if(result.nModified>0){
      res.status(200).json({ message: "Update successful!" });
    }

    else {
      res.status(401).json({message : "Not authorized!"})
    }

  });
});

*/
module.exports = router;
