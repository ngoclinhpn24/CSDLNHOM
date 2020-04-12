const Controller = require('./Controller');

const Report = require('../models/Report');

class ReportController extends Controller {
    static viewUserReports(req, res) {

    }

    static async saveReport(req, res) {
        let currentUser = req.currentUser;

        let status = {
            code: 1,
            message: 'Thanks for reporting'
        };

        if(currentUser){
            let data = req.body;
            let existReports = await Report.selectWhere(`ownerId = '${currentUser.id}' AND surveyId = '${data.surveyId}'`);
            if(existReports.length > 0){
                let existReport = existReports[0];
                existReport.content = data.content;
                await existReport.save();
            } else {
                await Report.create({
                    content: data.content,
                    surveyId: data.surveyId,
                    ownerId: currentUser.id
                });
            }

        } else {
            status.code = 0;
            status.message = 'You must sign in to send report.';
        }

        res.json(status);
    }
}

module.exports = ReportController;