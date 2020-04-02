const Controller = require('./Controller');

const Survey = require('../models/Survey');

class SurveyController extends Controller {
    static async viewSurveys(req, res) {
        // get data from database
        let surveys = await Survey.selectWhere('all');

        for(let survey of surveys){
            survey.owner = await survey.getOwner();
        }

        console.log(surveys);
        res.render('tmp', {surveys: surveys});
    }

    static viewOwnSurveys(req, res) {

    }

    static viewSurveyEditor(req, res) {

    }

    static handleSurveyEditor(req, res) {

    }

    static answerSurvey(req, res) {

    }

    static submitAnswers(req, res) {

    }

    static deleteSurvey(req, res) {

    }


}

module.exports = SurveyController;