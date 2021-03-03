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

var Posts = require('../Models/postsModel')
var posts_controller = require('../controllers/postsController')

var appDir = path.dirname(require.main.filename);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

// index
router.get('/', posts_controller.index);

// get all posts
router.get('/posts', posts_controller.get_all_posts);

//get individual post
router.get('/post/:id', posts_controller.get_post);

// get form
router.get('/create/post', posts_controller.get_create_post);


// Create post
router.post('/create/post', posts_controller.post_create_post);


// Get delete post
router.post('/delete/post/:id', posts_controller.post_delete_post);

// Post delete post
// router.post('/post/delete', posts_controller.post_delete_post);

// Get update post
// router.get('/post/update', posts_controller.get_update_post)

// Post update post
// router.post('/post/update', posts_controller.post_update_post)





module.exports = router;