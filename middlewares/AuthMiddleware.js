const User = require('../models/User');

class AuthMiddleware{

    static async auth(req, res, next){
        let userId = req.cookies.userId;
        let email = req.cookies.email;
        let result = await User.selectWhere(`id = '${userId}' AND email = '${email}'`);
        if(result.length > 0){
            req.currentUser = result[0];
        } else {
            req.currentUser = null;
        }
        next();
    }
    
}

module.exports = AuthMiddleware;