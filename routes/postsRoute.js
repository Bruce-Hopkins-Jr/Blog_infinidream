var express = require('express');
var router = express.Router();
var app = express(); 
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var posts_controller = require('../controllers/postsController')
var image_controller = require('../controllers/imageController')

// index
router.get('/', posts_controller.index);

/*
    Blogposts
*/

// get all posts
router.get('/posts', posts_controller.get_all_posts);

//get individual post
router.get('/posts/:id', posts_controller.get_post);

// get form
router.get('/post/create', posts_controller.get_create_post);


// Create post
router.post('/post/create', posts_controller.post_create_post);

// TEMPORARY DELETE
router.get('/post/:id/delete', function(req, res) {
    res.send('Are you sure you want to delete: ' + req.params.id + "?")
})

// Delete post
router.post('/post/:id/delete', posts_controller.post_delete_post);

// Get update post
router.get('/post/:id/update', posts_controller.get_update_post)

// Post update post
router.post('/post/:id/update', posts_controller.post_update_post)


/* 
    Images
*/

router.get('/images', image_controller.get_all_images);

router.get('/image/:name', image_controller.get_image);

router.post('/image', image_controller.post_images);

router.post('/image/:name/delete', image_controller.delete_image);






module.exports = router;