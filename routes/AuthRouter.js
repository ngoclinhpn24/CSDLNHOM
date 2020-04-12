// init router
let router = require('express').Router();

// include controller
let UserController = require('../controllers/UserController');

router.post('/sign_in', UserController.signIn);
router.post('/sign_up', UserController.signUp);
router.get('/profile', UserController.showProfile);
router.put('/profile', UserController.updateProfile);
router.get('/sign_out', UserController.signOut);

module.exports = router;