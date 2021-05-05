
let forumController = require('../controller/forumController');
let express = require('express');
let router = express.Router();

router.get('/forums/:idForum', forumController.getForumsById);
router.get('/forums', forumController.getAllForums);
router.post('/forums',forumController.addForum);
router.delete('/forums/:idForum',forumController.removeForum);
router.put('/forums/:idForum',forumController.modifyForum);
module.exports = router;
