var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostsSchema = new Schema(
  {
    image: { data: Buffer, contentType: String },
    name: {type: String},
  }
);

// Virtual for author's URL
PostsSchema
.virtual('url')
.get(function () {
  return '/api/posts/' + this.name;
});

//Export model
module.exports = mongoose.model('Image', PostsSchema);
