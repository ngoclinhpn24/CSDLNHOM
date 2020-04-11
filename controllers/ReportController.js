const Controller = require('./Controller');

const Report = require('../models/Report');

class ReportController extends Controller {
    static viewUserReports(req, res) {

    }

    static saveReport(req, res) {
        let currentUser = req.currentUser;

        let status = {
            code: 1,
            message: 'Thanks for reporting'
        };

        if(currentUser){
            
        } else {
            status.code = 0;
            status.message = 'You must sign in to send report.';
        }

        res.json(status);
    }
}

module.exports = ReportController;