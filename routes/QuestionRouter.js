let router = require('express').Router();

const QuestionController = require('../controllers/QuestionController');

router.get('/delete/:id', QuestionController.deleteQuestion);

module.exports = router;