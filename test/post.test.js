let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;

var Posts = require('../Models/postsModel')
var server = require('../app');

var fs  = require('fs')
const blogpostExample = require('./exampleposts/createpost1.json')

var bitmap = fs.readFileSync('test/exampleposts/image-1614871205433');
var image = {
  data: fs.readFileSync('test/exampleposts/face.png'),
  contentType: 'image/png'
}


describe("Connects to database", function() {
  it("Should connect without error", function() {
    try {
      var mongoose = require('mongoose');
      var mongoDB = 'mongodb://127.0.0.1/Infinidreams_test';
      mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }
    catch{
      expect(false).to.equal(true);
    }
    finally {
      expect(true).to.equal(true);
    }
    });
});
chai.use(chaiHttp);

Posts.remove({}, (err) => {
});

describe('Blogposts', () => {
  

  /* 
    Post blogpost, without error
  */

  const blogpost = {
    title: blogpostExample.title,
    tags: blogpostExample.tags,
    body: blogpostExample.body,
    summary: blogpostExample.summary,
  }
  const errorPost = {
    tags: blogpostExample.tags,
    body: blogpostExample.body,
  }
  let id;

  describe('/POST blogposts', () => {

    it('it should be able to post the blog and have all properties', (done) => {
      chai.request(server)
      .post('/api/post/create')
      .field('Content-Type', 'multipart/form-data')
      .field(blogpost)
      // .attach('image', 'test/exampleposts/face.png')
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('body');
            res.body.should.have.property('tags');
            res.body.should.have.property('date_of_post');
            // res.body.should.have.property('thumbnail');
            id = res.body._id;
        done();
      });
      
    });

    it('it should not return any properties', (done) => {
      chai.request(server)
      .post('/api/post/create')
      .send(errorPost)
      .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.not.have.property('tags')
            res.body.should.not.have.property('body')
        done();
      });
    });

  });

  describe('/GET blogposts', () => {
    it('it should GET all the posts', (done) => {
      chai.request(server)
          .get('/api/posts')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
            done();
          });
    });

    it('it should GET one of the posts', (done) => {
      chai.request(server)
          .get('/api/posts/' + id)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('body');
                res.body.should.have.property('tags');
                res.body.should.have.property('date_of_post');
            done();
          });
    });
  });
})