var mongoose = require('mongoose');

const opts = { toJSON: { virtuals: true } };
var Schema = mongoose.Schema;

var PostsSchema = new Schema(
  {
    title: {type: String, required: true, maxlength: 100},
    tags: [String], //array of strings
    summary: {type: String},
    body: {type: String},
    thumbnail: { data: Buffer, contentType: String},
    thumbnail_name: {type: String},
    date_of_post: {type: Date}, 
  }, opts
);

// Virtual for author's URL
PostsSchema
.virtual('url')
.get(function () {
  return '/api/posts/' + this._id;
});

PostsSchema
.virtual('blogPostUrl')
.get(function () {
  return '/api/posts/' + this._id;
});


PostsSchema
.virtual('thumbnailString')
.get(function () {
  if (this.thumbnail.data) return this.thumbnail.data.toString('base64');
  return ""
});

function checkMonth(dateOfMonth) {
  var nameOfMonth = "";
  switch(dateOfMonth) {
    case 0:
      nameOfMonth = "Jan"
    case 1:
      nameOfMonth = "Feb"
    case 2:
      nameOfMonth = "Mar"
    case 3:
      nameOfMonth = "Apr"
    case 4:
      nameOfMonth = "May"
    case 5:
      nameOfMonth = "June"
    case 6:
      nameOfMonth = "July"
    case 7:
      nameOfMonth = "Aug"
    case 8:
      nameOfMonth = "Sept"
    case 9:
      nameOfMonth = "Oct"
    case 10:
      nameOfMonth = "Nov"
    case 11:
      nameOfMonth = "Dec"  
  }
  return nameOfMonth;
}

PostsSchema
.virtual('FormattedDateOfPost')
.get(function () {
  if (this.date_of_post) return `${this.date_of_post.getDate()} ${checkMonth(this.date_of_post.getMonth())} ${this.date_of_post.getFullYear()}`;
  return ""
});

module.exports = mongoose.model('Posts', PostsSchema);
