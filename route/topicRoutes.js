let express = require('express');

let router = express.Router();

let topicController = require('../controller/topicController');

router.get('/topics', topicController.getTopics);
router.get('/topics/:idTopic',topicController.getTopicById);
router.get('/topics/themes/:idTheme',topicController.getTopicsByTheme);
router.post('/topics',topicController.addTopic);
router.put('/topics/:idTopic',topicController.modifyTopic);
router.put('/topics/:idTopic/:state',topicController.changeState);
router.delete('/topics/:idTopic',topicController.removeTopic);
router.put('/topics/add/Comment/:idTopic',topicController.addComment);
router.put('/topics/delete/Comment/:idTopic',topicController.deleteComment);

module.exports = router;
