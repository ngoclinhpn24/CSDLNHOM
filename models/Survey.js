const Model = require('./Model');

class Survey extends Model{
    static table = 'surveys';

    id;
    title;
    hashTag;
    description;
    ownerId;
    dateModified;

    async getQuestions(){

    }

    async getOwner(){

    }

    async getResult(){

    }

    async getReports(){

    }

}

module.exports = Survey;