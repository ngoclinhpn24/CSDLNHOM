const Model = require('./Model');

class Question extends Model{

    static table = 'questions';
    id;
    content;
    dateModified;

    async getAnswers(){
        
    }

}

module.exports = Question;