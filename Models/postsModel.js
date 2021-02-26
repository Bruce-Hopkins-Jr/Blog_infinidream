var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostsSchema = new Schema(
  {
    title: {type: String, required: true, maxlength: 100},
    tags: [String], //array of strings
    summary: {type: String},
    body: {type: String},
    thumbnail: { data: Buffer, contentType: String },
    date_of_post: {type: Date}, 
  }
);

// Virtual for author's URL
PostsSchema
.virtual('url')
.get(function () {
  return '/api/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Posts', PostsSchema);
