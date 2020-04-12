const Controller = require('./Controller');

class HomeController extends Controller{
    static index(req, res){
        let currentUser = req.currentUser;
        res.render('app', {currentUser: currentUser});
    }

    static about(req, res){
        res.send('this is about us');
    }
}

module.exports = HomeController;