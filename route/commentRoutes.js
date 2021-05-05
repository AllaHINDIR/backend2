
let commentController = require('../controller/commentController');

let express = require('express');

let router = express.Router();

router.get('/comments/topics/:idTopic', commentController.getCommentsByPost);
router.post('/comments',commentController.addComment);
router.delete('/comments/:idComment',commentController.removeComment);
router.put('/comments/:idComment',commentController.modifyComment);
router.get('/comments/topics/:idTopic/count', commentController.countCommentsByPost);
module.exports = router;





