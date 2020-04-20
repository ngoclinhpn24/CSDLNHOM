const Controller = require('./Controller');

const Report = require('../models/Report');

class ReportController extends Controller {
    static async viewUserReports(req, res) {
        let currentUser = req.currentUser;
        if(currentUser.authorization != 0) return;

        let reports = await Report.selectWhere('1 ORDER BY dateModified DESC');
        for(let report of reports){
            let owner = await report.getOwner();
            report.ownerId = owner.name;
            let survey = await report.getSurvey();
            report.surveyTitle = survey.title;
        }

        res.json(reports);
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