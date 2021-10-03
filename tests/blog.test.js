let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();
var request = require('supertest');
var path = require('path');

var Posts = require('../models/postsModel')
var server = require('../app');

const blogpostExample = require('./exampleposts/createpost1.json')
const blogpostExample2 = require('./exampleposts/updatepost.json');
const facepng = path.join(appRoot + '/tests/exampleposts/face.png')
chai.use(chaiHttp);

// Login info
const adminInfoJson = require('../config/adminInfo.json')
let adminInfo = {
  user: adminInfoJson.user,
  password: adminInfoJson.password
}

// Database test
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
      throw new Error('Cannot connect to database');
    }
  });
});

Posts.remove({}, (err) => {
});


// Before every test authenticate the user
var authenticatedUser = request.agent(server);
before(function(done){
  authenticatedUser
    .post('/api/login')
    .send(adminInfo)
    .end(function(err, response){
      expect(response.statusCode).to.equal(200);
      done();
    });
});

describe('Blogposts', () => {

  // Post blogpost, without error
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
  //  Login
  describe('/Login', () => {
    it('it should POST to login', (done) => {
      chai.request(server)
        .post('/api/login')
        .send(adminInfo)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });

    });
  });

  // POST
  describe('/POST blogposts', () => {

    it('it should be able to post the blog and have all properties', (done) => {
      authenticatedUser
        .post('/api/post/create')
        .field('Content-Type', 'multipart/form-data')
        .field(blogpost)
        .attach('image', facepng)
        .end((err, res) => {
          if (err) throw err
          res.should.have.status(200);
          id = res.body;
          done();
        });

    });

    //Should return 200 but not have any properties
    it('it should not return any properties', (done) => {
      authenticatedUser
        .post('/api/post/create')
        .send(errorPost)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });


    it('it should fail without login data', (done) => {
      chai.request(server)
        .post('/api/post/create')
        .field('Content-Type', 'multipart/form-data')
        .field(blogpost)
        // .attach('image', 'test/exampleposts/face.png')
        .end((err, res) => {
          res.should.have.status(403);
          // id = res.body;
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

    it('it should return four titles', (done) => {
      chai.request(server)
        .get('/api/recent-posts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body.length).to.be.below(5)
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
    it('it should be able to UPDATE the last post', (done) => {
      authenticatedUser
        .put('/api/post/' + id + '/update')
        .field('Content-Type', 'multipart/form-data')
        .field(updatedPost)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it('it should fail without login data', (done) => {
      chai.request(server)
        .put('/api/post/' + id + '/update')
        .field('Content-Type', 'multipart/form-data')
        .field(updatedPost)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('it should GET updated values', (done) => {
      chai.request(server)
        .get('/api/posts/' + id)
        .end((err, res) => {
          console.log(res.body.body)
          console.log(updatedPost.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.should.have.property('title');
          res.body.title.should.be.a('string')

          res.body.should.have.property("summary")
          res.body.summary.should.be.a('string')

          res.body.should.have.property('body');
          res.body.body.should.be.a('string')

          res.body.should.have.property('tags');
          res.body.tags.should.be.a('array')

          res.body.should.have.property('date_of_post');
          done();
        });
    });
    

  });

  // DELETE 

  describe('/DELETE blogposts', () => {

    it('it should DELETE without error', (done) => {
      authenticatedUser
        .delete('/api/post/' + id + '/delete')
        .end((err, res) => {
          res.should.have.status(302);
          done();
        });
    });

    it('it should not DELETE without login data', (done) => {
      chai.request(server)
        .delete('/api/post/' + id + '/delete')
        .end((err, res) => {
          res.should.have.status(403);
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


