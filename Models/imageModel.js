var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostsSchema = new Schema(
  {
    thumbnail: { data: Buffer, contentType: String },
  }
);

// Virtual for author's URL
PostsSchema
.virtual('url')
.get(function () {
  return '/api/posts/' + this._id;
});

//Export model
module.exports = mongoose.model('Posts', PostsSchema);
