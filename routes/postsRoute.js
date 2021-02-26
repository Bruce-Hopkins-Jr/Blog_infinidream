var express = require('express');
var router = express.Router();
var app = express(); 

var posts_controller = require('../controllers/postsController')

// index
router.get('/', posts_controller.index);

// get all posts
router.get('/posts', posts_controller.get_all_posts);

//get individual post
router.get('/post/:id', posts_controller.get_post)



module.exports = router;