const Model = require('./Model');

class Report extends Model{
    static table = 'reports';

    id;
    content;
    ownerId;
    surveyId;
    dateModified;

    async getOwner(){
        let owner = await require('./User').find(this.ownerId);
        return owner;
    }

    async getSurvey(){
        let survey = await require('./Survey').find(this.surveyId);
        return survey;
    }
}

module.exports = Report;