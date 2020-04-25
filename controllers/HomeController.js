const Controller = require('./Controller');

class HomeController extends Controller{
    static async index(req, res){
        let currentUser = req.currentUser;

        let users = await require('../models/User').selectWhere('all');
        let usersNumber = users.length;

        let surveys = await require('../models/Survey').selectWhere('all');
        let surveysNumber = surveys.length;

        res.render('app', {
            currentUser: currentUser, 
            usersNumber: usersNumber,
            surveysNumber: surveysNumber
        });
    }

    static about(req, res){
        res.send('this is about us');
    }
}

module.exports = HomeController;