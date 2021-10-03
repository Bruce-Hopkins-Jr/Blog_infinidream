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
  switch(dateOfMonth) {
    case 0:
      return "Jan"
    case 1:
      return "Feb"
    case 2:
      return "Mar"
    case 3:
      return "Apr"
    case 4:
      return "May"
    case 5:
      return "June"
    case 6:
      return "July"
    case 7:
      return "Aug"
    case 8:
      return "Sept"
    case 9:
      return "Oct"
    case 10:
      return "Nov"
    case 11:
      return "Dec"  
  }
}

PostsSchema
.virtual('FormattedDateOfPost')
.get(function () {
  if (this.date_of_post) return `${this.date_of_post.getDate()} ${checkMonth(this.date_of_post.getMonth())} ${this.date_of_post.getFullYear()}`;
  return ""
});

module.exports = mongoose.model('Posts', PostsSchema);
