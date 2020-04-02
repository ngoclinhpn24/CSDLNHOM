const Controller = require('./Controller');
const User = require('../models/User');

class UserController extends Controller {

    static auth(req, res){
        res.send('this is sign in / sign up form');
    }

    static async signIn(req, res) {
        // get data from request
        let data = req.body;

        // query database
        let result = await User.selectWhere(`email = '${data.email}' AND password = '${data.password}'`);
        
        res.json(result);
    }

    static async signUp(req, res) {
        // get data from request
        let data = req.body;

        // check exist email
        let existEmail = await User.selectWhere(`email = '${data.email}'`);

        if(existEmail.length > 0){
            res.send('Email has been used by another account');
        } else {

            // create user
            await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                authorization: 1
            });

            res.send('Sign Up Successfully');
        }

    }

    static showProfile(req, res) {

    }

    static updateProfile(req, res) {

    }

    static checkAuth(req, res) {

    }


}

module.exports = UserController;