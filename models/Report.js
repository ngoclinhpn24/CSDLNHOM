const Model = require('./Model');

const User = require('./User');
const Survey = require('./Survey');

class Report extends Model{
    static table = 'reports';

    id;
    content;
    ownerId;
    surveyId;
    dateModified;

    async getOwner(){
        let owner = await User.find(this.ownerId);
        return owner;
    }

    async getSurvey(){
        let survey = await Survey.find(this.surveyId);
        return survey;
    }
}

module.exports = Report;