const Controller = require('./Controller');

const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

class SurveyController extends Controller {
    static async viewSurveys(req, res) {
        // get data from database
        let surveys = await Survey.selectWhere('1 ORDER BY dateModified DESC');

        for(let survey of surveys){
            survey.owner = await survey.getOwner();
            survey.voteNumber = await survey.getVoteNumber();
        }

        res.render('survey/index', {surveys: surveys, currentUser: req.currentUser});
    }

    static async viewOwnSurveys(req, res) {
        let currentUser = req.currentUser;

        if(!currentUser){
            res.render('layouts/error');
            return;
        }

        let surveys = await Survey.selectWhere(`ownerId = '${currentUser.id}' ORDER BY dateModified DESC`);
        for(let survey of surveys){
            survey.voteNumber = await survey.getVoteNumber();
        }
        res.render('survey/survey_management', {surveys: surveys});
    }

    static async viewSurveyEditor(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser){
            res.render('layouts/error');
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
            let currentSurvey = await Survey.find(surveyId);
            surveyInfo.id = currentSurvey.id;
            surveyInfo.title = currentSurvey.title;
            surveyInfo.hashTag = currentSurvey.hashTag;
            surveyInfo.description = currentSurvey.description;

            let currentQuestions = await currentSurvey.getQuestions();
            for(let currentQuestion of currentQuestions){
                let jsonData = JSON.parse(currentQuestion.content);
                let question = {
                    id: currentQuestion.id,
                    type: jsonData.type,
                    content: jsonData.content,
                    choices: jsonData.choices || null
                };
                surveyQuestions.push(question);
            }
        }

        res.render('survey/survey_editor', {
            surveyInfo: surveyInfo,
            surveyQuestions: surveyQuestions
        });
    }

    static async handleSurveyEditor(req, res) {
        let status = {
            code: 1,
            message: ''
        };

        let currentUser = req.currentUser;
        if(!currentUser) return; 

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

        res.json(status);
    }

    static async answerSurvey(req, res) {
        let currentUser = req.currentUser;
        if(!currentUser){
            res.render('layouts/error');
            return;
        }

        let surveyId = req.params.id;
        let currentSurvey = await Survey.find(surveyId);
        currentSurvey.owner = await currentSurvey.getOwner();
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


        res.render('survey/survey_answer_sheet', {survey: currentSurvey, questions: questions});
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
            res.render('layouts/error');
            return;
        }
        // get current survey
        let currentSurvey = await Survey.find(surveyId);
        currentSurvey.owner = await currentSurvey.getOwner();
        currentSurvey.voteNumber = await currentSurvey.getVoteNumber();

        // get all questions in raw
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

        // console.log(questions);

        res.render('survey/survey_result', {survey: currentSurvey, questions: questions});

    }

    static deleteSurvey(req, res) {

    }


}

module.exports = SurveyController;