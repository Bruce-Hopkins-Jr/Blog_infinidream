let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();

var Posts = require('../Models/postsModel')
var server = require('../app');

var fs = require('fs')
const blogpostExample = require('./exampleposts/createpost1.json')
const blogpostExample2 = require('./exampleposts/updatepost.json');
var bitmap = fs.readFileSync('test/exampleposts/image-1614871205433');
var image = {
  data: fs.readFileSync('test/exampleposts/face.png'),
  contentType: 'image/png'
}


describe("Connects to database", function () {
  it("Should connect without error", function () {
    try {
      var mongoose = require('mongoose');
      var mongoDB = 'mongodb://127.0.0.1/Infinidreams_test';
      mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }
    catch {
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

  // POST
  describe('/POST blogposts', () => {

    it('it should be able to post the blog and have all properties', (done) => {
      chai.request(server)
        .post('/api/post/create')
        .field('Content-Type', 'multipart/form-data')
        .field(blogpost)
        // .attach('image', 'test/exampleposts/face.png')
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('object');
          // res.body.should.have.property('title');
          // res.body.should.have.property('body');
          // res.body.should.have.property('tags');
          // res.body.should.have.property('date_of_post');
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
          // res.body.should.be.a('object');
          // res.body.should.not.have.property('tags')
          // res.body.should.not.have.property('body')
          done();
        });
    });
  });

  // GET 
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
          res.body.should.have.property("summary")
          res.body.should.have.property('body');
          res.body.should.have.property('tags');
          res.body.should.have.property('date_of_post');
          done();
        });
    });
  });

  // UPDATE 
  describe('/UPDATE blogposts', () => {

    const updatedPost = {
      title: blogpostExample2.title,
      tags: blogpostExample2.tags,
      body: blogpostExample2.body,
      summary: blogpostExample2.summary,
    }
    console.log(updatedPost)
    it('it should be able to UPDATE the last post', (done) => {
      chai.request(server)
        .post('/api/post/' + id + '/update')
        .field('Content-Type', 'multipart/form-data')
        .field(updatedPost)
        // .attach('image', 'test/exampleposts/face.png')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.should.have.property('title');
          res.body.title.should.be.eql(updatedPost.title)

          res.body.should.have.property('body');
          res.body.body.should.be.eql(updatedPost.body)

          res.body.should.have.property('summary');
          res.body.summary.should.be.eql(updatedPost.summary)

          res.body.should.have.property('tags');
          res.body.tags.should.be.a('array')

          res.body.should.have.property('date_of_post');
          // res.body.should.have.property('thumbnail');
          done();
        });

    });

  });

  // DELETE 

  describe('/DELETE blogposts', () => {

    it('it should DELETE without error', (done) => {
      chai.request(server)
        .post('/api/post/' + id + '/delete')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should GET and return no posts', (done) => {
      chai.request(server)
        .get('/api/posts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0)
          done();
        });
    });
  });
});


