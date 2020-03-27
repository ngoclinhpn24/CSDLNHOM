const Model = require('./Model');

class Answer extends Model{
    static table = 'answers';

    id;
    content;
    ownerId;
    questionId;
    dateModified;

    async getOwner(){
        
    }
}

module.exports = Answer;