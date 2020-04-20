const DB = require('../databases/init');

const Model = require('./Model');
const User = require('./User');
const Question = require('./Question');

class Survey extends Model{
    static table = 'surveys';

    id;
    title;
    hashTag;
    description;
    ownerId;
    dateModified;

    async getQuestions(){
        let questions = await Question.selectWhere(`surveyId = '${this.id}'`);
        return questions;
    }

    async getOwner(){
        let owner = await User.find(this.ownerId);
        return owner;
    }

    async getVoteNumber(){
        let [row] = await DB.promise().query(`
            SELECT MAX(c) AS voteNumber
            FROM 
            (SELECT COUNT(*) AS c 
                FROM answers 
                WHERE questionId IN (SELECT id FROM questions WHERE questions.surveyId = '${this.id}') 
                GROUP BY questionId) AS a
        `);
        let result = (row[0].voteNumber) ? row[0].voteNumber : 0 ;
        return result;
    }

}

module.exports = Survey;