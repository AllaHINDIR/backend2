let themeController = require('../controller/themeController');

let express = require('express');
const multer = require('multer');
const path = require('path');

let router = express.Router();

//************************************ */

const storage = multer.diskStorage({
    destination : function (req,file,cb) {
        cb(null,path.join('uploads/images'));
    },
    filename : function (req,file,cb) {
        cb(null,path.join(Date.now().toString()+file.originalname));
    }
})

const fileFilter = (req,file,cb)=>{
    //reject a file
    if(file.mimetype==='image/jpeg' || file.mimetype ==='image/png' || file.mimetype==='image/jpg'){
        cb(null,true);
    }else {
        cb(null,false);
    }
};

const upload =multer({storage:storage, limits: {
    fileSize : 1024*1024*5
},
fileFilter : fileFilter
});

//************************************ */

router.post('/themes',upload.single('image'), themeController.addTheme);
router.get('/themes', themeController.getAllThemes);
router.get('/themes/:idTheme', themeController.getThemeById);
router.get('/themes/forums/:idForum', themeController.getThemesByForum);
router.get('/themes', themeController.getAllThemes);
router.put('/themes/:idTheme',themeController.modifyTheme)
router.put('/themes/:idTheme/views',themeController.setViews)
router.delete('/themes/:idTheme',themeController.removeTheme)
module.exports = router;
