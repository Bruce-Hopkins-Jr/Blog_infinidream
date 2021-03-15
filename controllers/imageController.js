var express = require('express');
var app = express(); 
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
const { body,validationResult } = require("express-validator");

var Image = require("../models/imageModel")

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var upload = multer({dest: 'public/images'});

exports.get_all_images = function(req, res) {
    res.send("get all images not implemented");
}

exports.get_create_images = function(req, res) {
    res.render('imageTest', { title: 'Create Image'});
}

exports.post_create_images = [
    upload.single('image'),
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Name must be specified'),


    (req, res, next) => {

        var ext = path.extname(req.file.originalname).toLowerCase();
        var tempPath =  path.resolve(appRoot + '/' + req.file.path);
        var targetPath = path.resolve(appRoot + '/public/images/' + req.body.name);


        if(ext==='.png' || ext==='.jpg' || ext==='.jpeg' || ext==='.gif'){
            // data = fs.readFileSync(path.join(tempPath))
            if (fs.existsSync(targetPath)){
                res.send("Please change the name, that image already exists")
            }
            else {
                targetPath = targetPath + ext;
                fs.rename(tempPath,targetPath,function(err){
                    if(err) throw err;
                    image = new Image ({ name: req.body.name })
                    image.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(image.path + ext);
                        // res.send("Image downloaded. ")
                    });

                });
            }

        }
        else{
            fs.unlink(tempPath,function(){
                if(err) throw err;
                res.json(500,{error:'Only image files are allowed'});
            });
        }


    }
]

exports.get_image = function(req, res) {
    res.send("get image not implemented")
}
exports.delete_image = function(req, res) {
    res.send("delete image not implemented")
}
