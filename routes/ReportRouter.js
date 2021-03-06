const router = require('express').Router();

const ReportController = require('../controllers/ReportController');

router.get('/', ReportController.viewUserReports);
router.post('/', ReportController.saveReport);

module.exports = router;