// init router
let router = require('express').Router();

// include controller
let UserController = require('../controllers/UserController');

router.get('/auth', UserController.auth);
router.post('/sign_in', UserController.signIn);
router.post('/sign_up', UserController.signUp);
router.get('/profile', UserController.showProfile);
router.put('/profile', UserController.updateProfile);


module.exports = router;