var express = require('express');
var router = express.Router();

var loginController = require('../controllers/loginController');

/* 
    Login
*/

// Post login
router.post('/login', loginController.post_login);

// Checks if ther user is logged in
router.get('/validate-login', loginController.validateLogin, loginController.confirmLogin)

module.exports = router;
