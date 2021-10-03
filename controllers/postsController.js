const { body,validationResult } = require("express-validator");
var multer = require('multer');
var fs = require('fs');
var path = require('path');

var Posts = require('../models/postsModel')

// Image upload config
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });


// GET all the posts of the blog. Sorts the posts by the latest post first.
exports.get_all_posts = function(req, res) {
    Posts.find()
    .sort({_id:-1})
    .exec(function (err, results) {
        if (err) return next(err);
        if (results) res.send(results)
        else {
            res.status(404).json({message: "Posts not found"})
            res.status(404)
        }
    }); 
};

// GET a specific post
exports.get_post = function(req, res, next) {
    Posts.findById(req.params.id)
    .exec(function (err, results) {
        if (err) return next(err);
        if (results) res.json(results)
        else {
            res.status(404).json({message: "Post not found"})
            res.status(404)
        }
    }); 

}
//  Creates a post
exports.post_create_post = [
    upload.single('image'),
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('tags.*'),
    body('summary').trim().isLength({ min: 1 }).withMessage('Summary must be specified.'),
    body('body').trim().isLength({ min: 1 }).withMessage('Body must be specified.'),

    (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://blog.infinidream.net/"); // * important
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.status(400).send("There was a problem posting your request: " + errors.array())
            return;
        }
        else {
            post = new Posts;
            let imageData;
            // Post has thumnail, save it
            if (req.file) {
                try {
                    imageData = {
                        data: fs.readFileSync(path.join(appRoot + '/uploads/' + req.file.filename)),
                        contentType: 'image/jpeg'
                    }

                } catch {
                    imageData = ''
                }
                let imageName = req.file.filename;
                post = new Posts(
                    {
                        title: req.body.title,
                        tags: req.body.tags,
                        summary: req.body.summary,
                        body: req.body.body,
                        date_of_post: Date.now(),
                        thumbnail: imageData,
                        thumbnail_name: imageName
                    })

            }
            // Failed to find a thumnail so proceed without one
            else {
                post = new Posts(
                {
                    title: req.body.title,
                    tags: req.body.tags,
                    summary: req.body.summary,
                    body: req.body.body,
                    date_of_post: Date.now()
                })
            }
            post.save(function (err) {
                if (err) { return next(err); }
                res.send(post._id)
            });

        }
    }

]

// Deletes a post along with the thumbnail used
exports.post_delete_post = function(req, res) {
    Posts.findById(req.params.id)
    .exec(function (err, results) {
        if (err) { return next(err); }
        if (results) {
            Posts.findByIdAndRemove(req.params.id, function deletePost(err) {
                if (err) { return next(err); }
                fs.readdir(path.join(appRoot + '/uploads/'), function(err, files) {
                    if (err) console.log("Error getting directory information.")
                    // Go through the uploads files and delete the previous image.
                    else {
                      files.forEach(function(file) {
                        if (file == results.thumbnail_name) { 
                            fs.unlinkSync(path.join(appRoot + '/uploads/') + file, function(err) {
                                if (err) console.log(err)
                            })
                        }
                      })
                    }
                  })
                
                res.redirect('/')
            })
        } else {
            res.status(404).json({message: "Post not found"})
            res.status(404)
            
        }
    }); 

};

// Update Post
exports.post_update_post = [

    upload.single('image'),
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('tags.*'),
    body('summary').trim().isLength({ min: 1 }).withMessage('Summary must be specified.'),
    body('body').trim().isLength({ min: 1 }).withMessage('body must be specified.'),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('test', { title: 'Error', errors: errors.array() });
            return;
        }
        else {
            var imagePath;
            try {
                imagePath = {
                    data: fs.readFileSync(path.join(appRoot + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }

            } catch {
                imagePath = ''
            }

            const post = new Posts(
                {
                    title: req.body.title,
                    tags: req.body.tags,
                    summary: req.body.summary,
                    body: req.body.body,
                    date_of_post: Date.now(),
                    thumbnail: imagePath,
                    _id: req.params.id,
                })
            // We run find by id to find the old thumbnail and remove it.
            Posts.findById(req.params.id).exec(function (err, results) {
                if(err) console.error(err)
                // Update post
                Posts.findByIdAndUpdate(req.params.id, post, {}, function (err, thepost) {
                    if (err) { return next(err); }
                    res.send(thepost)
                });
            })

        }
   }
]

//  Recent posts for sidebar
exports.get_recents_sidebar = function(req, res) {
    Posts.find({}, 'title')
    .limit(4)
    .sort({_id: -1})
    .exec(function (err, results) {
        res.status(200)
        res.send(results)
    })

}
