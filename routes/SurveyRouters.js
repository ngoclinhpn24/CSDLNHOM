const router = require('express').Router();

const SurveyController = require('../controllers/SurveyController');

router.get('/', SurveyController.viewSurveys);
router.get('/manage', SurveyController.viewOwnSurveys);

router.get('/editor/:id?', SurveyController.viewSurveyEditor);
router.post('/editor/:id?', SurveyController.handleSurveyEditor);

router.get('/answer/:id', SurveyController.answerSurvey)
router.post('/answer/:id', SurveyController.submitAnswers);

router.delete('/delete/:id', SurveyController.deleteSurvey);

module.exports = router;