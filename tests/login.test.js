let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();
var request = require('supertest');

var Posts = require('../models/postsModel')
var server = require('../app');
var config = require('../config/adminInfo.json')
Posts.remove({}, (err) => {
});

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

// TODO, Add Befores and Afters to make tests more efficient
let adminInfo = {
  user: config.user,
  password: config.password
}
// Before
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

describe('Login', () => {

  it('It should POST to login', (done) => {
    chai.request(server)
      .post('/api/login')
      .send(adminInfo)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  })

  it('It should be able to login correctly and confirm the login', (done) => {
    authenticatedUser
      .get('/api/validate-login')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.equal("User is logged in")
        done();
      });
  })

  it('It should fail login', (done) => {
    chai.request(server)
      .get('/api/validate-login')
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  })



});

