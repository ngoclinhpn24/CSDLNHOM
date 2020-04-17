const Model = require('./Model');

const Answer = require('./Answer');

class Question extends Model{

    static table = 'questions';
    id;
    content;
    surveyId;
    dateModified;

    async getAllAnswers(){
        let answers = await Answer.selectWhere(`questionId = '${this.id}' ORDER BY dateModified DESC`);
        return answers;
    }

    async getUserAnswer(userId){
        let answers = await Answer.selectWhere(`questionId = '${this.id}' AND ownerId = '${userId}' ORDER BY dateModified DESC`);
        let answer = answers[0];
        if(!answer) return null;
        return answer;
    }

}

module.exports = Question;