const Model = require('./Model');

class Report extends Model{
    static table = 'reports';

    id;
    content;
    ownerId;
    surveyId;
    dateModified;

    async getOwner(){
        
    }
}

module.exports = Report;