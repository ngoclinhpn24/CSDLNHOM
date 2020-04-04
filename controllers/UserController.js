const Controller = require('./Controller');
const User = require('../models/User');

class UserController extends Controller {

    static account(req, res){
        res.render('user/auth');
    }


    static async signIn(req, res) {
        // get data from request
        let data = req.body;

        // query database
        let result = await User.selectWhere(`email = '${data.email}' AND password = '${data.password}'`);
        let status = {
            code: 1,
            message: ''
        };
        if(result.length > 0){
            let currentUser = result[0];
            res.cookie('userId', currentUser.id);
            res.cookie('email', currentUser.email);
        } else {
            status.code = 0;
            status.message = 'Your email or password is incorrect.'
        }

        res.json(status);
    }

    static async signUp(req, res) {
        // get data from request
        let data = req.body;
        // console.log(data);
        
        // check exist email
        let existEmail = await User.selectWhere(`email = '${data.email}'`);

        let status = {
            code: 1,
            message: 'You have just created your account. Sign in for now!'
        };
        
        if(existEmail.length > 0){
            status.code = 0;
            status.message = 'The email has been used by another account';
        } else {
            // create user
            await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                authorization: 1
            });
        }

        res.json(status);
    }

    static showProfile(req, res) {

    }

    static updateProfile(req, res) {

    }

    static signOut(req, res){
        res.clearCookie('userId');
        res.clearCookie('email');
        res.redirect('/');
    }

}

module.exports = UserController;