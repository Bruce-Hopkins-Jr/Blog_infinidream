var async = require('async');
const { body,validationResult } = require("express-validator");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var Posts = require('../models/postsModel')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });


exports.index = function(req, res) {

    async.parallel({
        posts_count: function(callback) {
            Posts.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        posts_find: function(callback) {
            Posts.find({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Home page', error: err, data: results });
    });
}; // for testing

exports.get_all_posts = function(req, res) {
    Posts.find()
    .exec(function (err, results) {
        if (err) { return next(err); }
        if (results) {
            res.json(results)
        } else {
            res.status(404).json({message: "Posts not found"})
            res.status(404)
            throw new Error('Post not found')
        }
    }); 
};

exports.get_post = function(req, res, next) {
    Posts.findById(req.params.id)
    .exec(function (err, results) {
        if (err) { return next(err); }
        if (results) {
            res.json(results)
        } else {
            res.status(404).json({message: "Post not found"})
            res.status(404)
            throw new Error('Post not found')
        }
    }); 
}
exports.get_create_post = function(req, res, next) {
    res.render('test', { title: 'Home page' });
} // for testing

exports.post_create_post = [
    

    upload.single('image'),
    body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),
    body('tags.*').escape(),
    body('summary').trim().isLength({ min: 1 }).escape().withMessage('Summary must be specified.'),
    body('body.*').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),

    (req, res, next) => {

    
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('test', { title: 'Error', errors: errors.array() });
            return;
        }
        else {
            var imagePath
            try {
                imagePath = {
                    data: fs.readFileSync(path.join(appRoot + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }

            } catch {
                imagePath = ''
            }

            var post = new Posts(
                {
                    title: req.body.title,
                    tags: req.body.tags,
                    summary: req.body.summary,
                    body: req.body.body,
                    date_of_post: Date.now(),
                    thumbnail: imagePath
                })
                /* */
            post.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(post.url);
            });

        }
   }
]

exports.post_delete_post = function(req, res) {
    Posts.findById(req.params.id)
    .exec(function (err, results) {
        if (err) { return next(err); }
        if (results) {
            Posts.findByIdAndRemove(req.params.id, function deletePost(err) {
                if (err) { return next(err); }
                // Success - go to genre list
                res.redirect('/')
            })
        } else {
            res.status(404).json({message: "Post not found"})
            res.status(404)
            throw new Error('Post not found')
        }
    }); 

};

exports.get_update_post = function(req, res) {
    Posts.findById(req.params.id)
    .exec(function (err, blogpost) {
        if (err) { return next(err); }
        if (blogpost) {
            res.render('test', { title: 'Update page', post: blogpost});
        } else {
            res.status(404).json({message: "Post not found"})
            res.status(404)
            throw new Error('Post not found')
        }
    }); 
}

exports.post_update_post = [

    upload.single('image'),
    body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),
    body('tags.*').escape(),
    body('summary').trim().isLength({ min: 1 }).escape().withMessage('Summary must be specified.'),
    body('body.*').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),

    (req, res, next) => {

    
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('test', { title: 'Error', errors: errors.array() });
            return;
        }
        else {
            var imagePath
            try {
                imagePath = {
                    data: fs.readFileSync(path.join(appRoot + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }

            } catch {
                imagePath = ''
            }

            var post = new Posts(
                {
                    title: req.body.title,
                    tags: req.body.tags,
                    summary: req.body.summary,
                    body: req.body.body,
                    date_of_post: Date.now(),
                    thumbnail: imagePath,
                    _id: req.params.id,
                })
                /* */
            Posts.findByIdAndUpdate(req.params.id, post, {}, function (err, thepost) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(post.url);
            });

        }
   }

]






