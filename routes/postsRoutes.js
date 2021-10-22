var express = require('express');
var router = express.Router();

var postsController = require('../controllers/postsController')
var loginController = require('../controllers/loginController')


/*
    Blogposts
*/

// get all posts
router.get('/posts', postsController.get_all_posts);

//get individual post
router.get('/posts/:id', postsController.get_post);

// Create post
router.post('/post/create', loginController.validateLogin, postsController.post_create_post);

// Delete post
router.delete('/post/:id/delete', loginController.validateLogin,  postsController.post_delete_post);

// Post update post
router.post('/post/:id/update', loginController.validateLogin,  postsController.post_update_post)

// Gets recent posts for sidebar
router.get('/recent-posts',  postsController.get_recents_sidebar)

router.get('/previous-post/:id',  postsController.get_previous_post)

module.exports = router;
