var Posts = require('../Models/postsModel')
var async = require('async');

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
};

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