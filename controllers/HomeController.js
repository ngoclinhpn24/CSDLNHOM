const Controller = require('./Controller');

class HomeController extends Controller{
    static index(req, res){
        let name = (req.currentUser) ? req.currentUser.name : '';
        res.render('app', {name: name});
    }

    static about(req, res){
        res.send('this is about us');
    }
}

module.exports = HomeController;