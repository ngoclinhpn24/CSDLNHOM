const router = require('express').Router();

const SurveyController = require('../controllers/SurveyController');

router.get('/', SurveyController.viewSurveys);
router.get('/management', SurveyController.viewOwnSurveys);

router.get('/editor/:id?', SurveyController.viewSurveyEditor);
router.post('/editor/:id?', SurveyController.handleSurveyEditor);

router.get('/answer/:id', SurveyController.answerSurvey)
router.post('/answer/:id?', SurveyController.submitAnswers);

router.get('/result/:id', SurveyController.showResult);

router.post('/search', SurveyController.searchSurveys);

router.delete('/delete/:id', SurveyController.deleteSurvey);

module.exports = router;