const Controller = require('./Controller');

const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Report = require('../models/Report');

class SurveyController extends Controller {
    static async viewSurveys(req, res) {
        // get data from database
        let surveys = await Survey.selectWhere('1 ORDER BY dateModified DESC');

        for(let survey of surveys){
            let owner = await survey.getOwner();
            survey.ownerId = owner.name;
            survey.voteNumber = await survey.getVoteNumber();
        }

        res.json(surveys);
    }

    static async viewOwnSurveys(req, res) {
        let currentUser = req.currentUser;

        if(!currentUser){
            res.json([]);
            return;
        }

        let surveys = await Survey.selectWhere(`ownerId = '${currentUser.id}' ORDER BY dateModified DESC`);
        for(let survey of surveys){
            survey.voteNumber = await survey.getVoteNumber();
        }
        
        res.json(surveys);
    }

    static async viewSurveyEditor(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser){
            res.json({message: 'Error!'});
            return;
        }

        let surveyInfo = {
            id: '',
            title: '',
            hashTag: '',
            description: ''
        };
        let surveyQuestions = [];

        let surveyId = req.params.id;

        if(surveyId){
            surveyInfo = await Survey.find(surveyId);

            let questionsRaw = await surveyInfo.getQuestions();

            surveyQuestions = questionsRaw.map(function(questionRaw){
                let jsonData = JSON.parse(questionRaw.content);
                return {
                    id: questionRaw.id,
                    type: jsonData.type,
                    content: jsonData.content,
                    choices: jsonData.choices || null
                };
                
            });
        }

        res.json({survey: surveyInfo, questions: surveyQuestions});
    }

    static async handleSurveyEditor(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser) {
            res.json({
                code: 0,
                message: 'Error!'
            });
            return;
        }; 

        let surveyData = req.body;
        
        // save survey info
        let surveyInfo = surveyData.surveyInfo;
        let surveyId = surveyInfo.id;
        if(surveyId){
            let currentSurvey = await Survey.find(surveyId);
            currentSurvey.title = surveyInfo.title;
            currentSurvey.hashTag = surveyInfo.hashTag;
            currentSurvey.description = surveyInfo.description;
            await currentSurvey.save();
        } else {
            let newSurvey = await Survey.create({
                title: surveyInfo.title,
                hashTag: surveyInfo.hashTag,
                description: surveyInfo.description,
                ownerId: currentUser.id
            });
            surveyId = newSurvey.id;
        }

        // save survey questions
        let surveyQuestions = surveyData.surveyQuestions;
        if(surveyQuestions) {
            for(let question of surveyQuestions){
                let questionId = question.id;

                delete question.id;
                let questionContent = JSON.stringify(question);

                if(questionId){
                    let currentQuestion = await Question.find(questionId);
                    currentQuestion.content = questionContent;
                    await currentQuestion.save();
                } else {
                    await Question.create({
                        content: questionContent,
                        surveyId: surveyId
                    });
                }
            }
        }

        res.json({code: 1});
    }

    static async answerSurvey(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser){
            res.render('layouts/error');
            return;
        }

        let surveyId = req.params.id;
        let currentSurvey = await Survey.find(surveyId);
        let owner = await currentSurvey.getOwner();

        currentSurvey.ownerId = owner.name;
        currentSurvey.voteNumber = await currentSurvey.getVoteNumber();

        let questionsRaw = await currentSurvey.getQuestions();
        let questions = [];
        for(let questionRaw of questionsRaw){
            let answerRaw = await questionRaw.getUserAnswer(currentUser.id);
            let answer = (answerRaw) ? answerRaw.content : '';
            let question = {
                id: questionRaw.id,
                data: JSON.parse(questionRaw.content),
                answer: answer
            };
            questions.push(question);
        }

        res.json({survey: currentSurvey, questions: questions});
    }

    static async submitAnswers(req, res) {
        let currentUser = req.currentUser;
        let surveyId = req.params.id;
        if(!currentUser || !surveyId) {
            res.render('layouts/error');
            return;
        }

        let answers = req.body;
        for(let key in answers){
            let questionId = key.split('-')[1];
            
            let answerContent = answers[key];
            let existAnswers = await Answer.selectWhere(`questionId = '${questionId}' AND ownerId = '${currentUser.id}'`);
            if(existAnswers.length > 0){
                let existAnswer = existAnswers[0];
                existAnswer.content = answerContent;
                await existAnswer.save();
            } else {
                await Answer.create({
                    questionId: questionId,
                    ownerId: currentUser.id,
                    content: answerContent
                });
            }
        }

        res.json({
            code: 1,
            message: 'Save answer successfully'
        });
    }

    static async showResult(req, res){
        let surveyId = req.params.id;
        if(!surveyId){
            res.json([]);
            return;
        }
        // get current survey
        let currentSurvey = await Survey.find(surveyId);
        let owner = await currentSurvey.getOwner();
        currentSurvey.ownerId = owner.name;
        currentSurvey.voteNumber = await currentSurvey.getVoteNumber();

        // get all questions in raw data
        let questions = [];
        let questionsRaw = await currentSurvey.getQuestions();

        for(let questionRaw of questionsRaw){
            
            let data = JSON.parse(questionRaw.content);
            let question = {
                id: questionRaw.id,
                type: data.type,
                content: data.content,
                choices: data.choices || null,
                answers: []
            };

            // get all answers
            let answersRaw = await questionRaw.getAllAnswers();
            if(question.type == 'Text Question'){
                question.answers = answersRaw;
            } else {
                question.answers = question.choices.map(() => 0);
                for(let answerRaw of answersRaw){
                    answerRaw.content.split(',').forEach(function(index){
                        index = Number(index);
                        if(question.choices[index]){
                            if(!question.answers[index]) {
                                question.answers[index] = 1;
                            } else {
                                question.answers[index] += 1;
                            }
                        }
                    });
                }
            }

            questions.push(question);
        }

        res.json({survey: currentSurvey, questions: questions});
    }

    static async searchSurveys(req, res){
        let data = req.body;
        console.log(data);
        let keyword = data.keyword;
        let foundSurveys = [];
        if(keyword.includes('#')){
            keyword = keyword.replace('#', '');
            foundSurveys = await Survey.selectWhere(`hashTag LIKE '%${keyword}%'`);
        } else {
            foundSurveys = await Survey.selectWhere(`title LIKE '%${keyword}%'`);
        }

        
        for(let survey of foundSurveys){
            let owner = await survey.getOwner();
            survey.ownerId = owner.name;
            survey.voteNumber = await survey.getVoteNumber();
        }

        res.json(foundSurveys);
    }

    static async deleteSurvey(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser) {
            res.send('error');
            return;
        }

        let surveyId = req.params.id;
        let survey = await Survey.find(surveyId);

        if(survey.ownerId == currentUser.id || currentUser.authorization == 0){

            // delete answer

            await Answer.deleteWhere(`questionId IN (SELECT id FROM questions WHERE surveyId = '${surveyId}')`);

            //  delete question
            await Question.deleteWhere(`surveyId = '${surveyId}'`);
            // delete report
            await Report.deleteWhere(`surveyId = '${surveyId}'`);
            // delete survey
            await survey.delete();
        }

        res.json({
            code: 1,
            message: ''
        });
    }


}

module.exports = SurveyController;