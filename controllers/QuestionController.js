const Controller = require('./Controller');

const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

class QuestionController extends Controller {
    static async deleteQuestion(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser){
            res.render('layouts/error');
            return;
        }
        
        let status = {
            code: 1
        };
        let questionId = req.params.id;
        let currentQuestion = await Question.find(questionId);
        let currentSurvey = await Survey.find(currentQuestion.surveyId);
        if(currentSurvey.ownerId != currentUser.id){
            res.render('layouts/error');
            return;
        }
        try {
            await Question.deleteWhere(`id = '${questionId}'`);
            await Answer.deleteWhere(`questionId = '${questionId}'`);
        } catch (e){
            console.log(e.message);
            status.code = 0;
        }

        res.json(status);
    }
}

module.exports = QuestionController;