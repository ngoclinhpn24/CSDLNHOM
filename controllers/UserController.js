const Controller = require('./Controller');

class UserController extends Controller {

    static auth(req, res){
        res.send('this is sign in / sign up form');
    }

    static signIn(req, res) {
        res.send('Sign In');
    }

    static signUp(req, res) {
    }

    static showProfile(req, res) {

    }

    static updateProfile(req, res) {

    }

    static checkAuth(req, res) {

    }


}

module.exports = UserController;