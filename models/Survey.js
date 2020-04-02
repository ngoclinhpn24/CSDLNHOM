const Model = require('./Model');

const User = require('./User');

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
        let owner = await User.find(this.ownerId);
        return owner;
    }

    async getResult(){

    }

    async getReports(){

    }

}

module.exports = Survey;