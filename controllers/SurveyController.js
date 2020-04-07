const Controller = require('./Controller');

const Survey = require('../models/Survey');
const Question = require('../models/Question');

class SurveyController extends Controller {
    static async viewSurveys(req, res) {
        // get data from database
        let surveys = await Survey.selectWhere('all');

        for(let survey of surveys){
            survey.owner = await survey.getOwner();
        }

        res.render('survey/index', {surveys: surveys, currentUser: req.currentUser});
    }

    static viewOwnSurveys(req, res) {

    }

    static viewSurveyEditor(req, res) {
        res.render('survey/survey_editor');
    }

    static async handleSurveyEditor(req, res) {
        let status = {
            code: 1,
            message: 'Create survey successfully'
        };

        let currentUser = req.currentUser;
        if(!currentUser) return; 

        let surveyData = req.body;
        
        // save survey info
        let surveyInfo = surveyData.surveyInfo;
        let newSurvey = await Survey.create({
            title: surveyInfo.title,
            hashTag: surveyInfo.hashTag,
            description: surveyInfo.description,
            ownerId: currentUser.id
        });

        // save survey questions
        let surveyQuestions = surveyData.surveyQuestions;
        // nếu người dùng ko thêm câu hỏi ở survey editor --> surveyData không chứa surveyQuestions
        // undefined ~ false
        if(surveyQuestions) {
            for(let question of surveyQuestions){
                let questionContent = JSON.stringify(question);
                await Question.create({
                    content: questionContent,
                    surveyId: newSurvey.id
                });
            }
        }

        res.json(status);
    }

    static answerSurvey(req, res) {

    }

    static submitAnswers(req, res) {

    }

    static deleteSurvey(req, res) {

    }


}

module.exports = SurveyController;