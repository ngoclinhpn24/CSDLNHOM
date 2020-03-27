const Model = require('./Model');

class User extends Model {
    static table = "users";

    id;
    name;
    email;
    password;
    authorization;
    dateModified;


    async getSurveys(){
        
    }

    async getReports() {

    }
}

module.exports = User;