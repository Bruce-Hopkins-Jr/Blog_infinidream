var express = require('express');
var router = express.Router();
var imageController = require('../controllers/imageController')
var loginController = require('../controllers/loginController')


/*
    Images
*/   

router.get('/images/', loginController.validateLogin, imageController.get_all_images);

router.get('/create-image', loginController.validateLogin, imageController.get_create_images);

router.post('/create-image', loginController.validateLogin, imageController.post_create_images);

router.post('/image/:name/delete', loginController.validateLogin, imageController.delete_image);

module.exports = router;
