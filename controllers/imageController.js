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
    Image.find()
    .exec(function (err, results) {
        if (err) { return next(err); }
        if (results) {
            res.json(results)
        } else {
            res.status(404).json({message: "Posts not found"})
            res.status(404)
            
        }
    }); 
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
        
        // If the extention is an image then change name and update to database.
        if(ext==='.png' || ext==='.jpg' || ext==='.jpeg' || ext==='.gif'){
            try {
                if (fs.existsSync(targetPath)){
                    res.send("Please change the name, that image already exists")
                }
                else {
                    targetPath = targetPath + ext;
                    fs.rename(tempPath,targetPath,function(err){
                        if(err) console.error(err) 
                        image = new Image ({ name: req.body.name + ext})
                        image.save(function (err) {
                            if (err) { return next(err); }
                            res.redirect(image.path);
                        });
    
                    });
                }
                
            }
            catch {
                res.json(500,{error:'Something went wrong'});
            }
        }
        else{
            fs.unlink(tempPath,function(){
                if(err) console.error(err) 
                res.json(500,{error:'Only image files are allowed'});
            });
        }


    }
]

exports.delete_image = function(req, res, next) {
    Image.findOne({'name': req.params.name})
    .exec(function (err, image){
        if (err) { return next(err); }
        
        let targetPath = path.resolve(appRoot + '/public/images/' + image.name);
        
        //  Delete file
        fs.unlink(targetPath,function(){

            if(err) console.error(err) 

            //Delete database intance
            Image.findByIdAndRemove(image.id, function deletePost(err) {
                if (err) { return next(err); }
                res.redirect('/')
            })
        });
    })
    
}
