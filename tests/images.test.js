let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();

var Image = require('../models/imageModel')

var fs = require('fs')
var server = require('../app');

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
// 
Image.remove({}, (err) => {});
describe('Images', () => {
    // POST image
    let name = {
      name: "ThisImage"
    }
    describe('/POST image', () => {
        it('it should POST', (done) => {
          chai.request(server)
            .post('/api/create-image')
            .field('Content-Type', 'multipart/form-data')
            .field(name)
            .attach('image', 'tests/exampleposts/Section.jpeg')
            .end((err, res) => {
              res.should.have.status(200);
              
              res.on('error', err => {
                console.error(err)
              })
              done();
            });
        });
    })
    // GET an array of image paths
    describe('/GET all images', () => {
      it('it should get an array', (done) => {
        chai.request(server)
          .get('/api/images') 
          .end((err, res) => {
            res.body.should.be.a('array');
            res.should.have.status(200);
            res.body.length.should.be.eql(1);
            done();
          });
      });
    })

    // DELETE image and database instance
    describe('/DELETE image', () => {
        it('it should DELETE the image', (done) => {
          chai.request(server)
            .post('/api/image/ThisImage.jpeg/delete')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    })

    // GET an empty array
    describe('/GET all images', () => {
      it('it should be an empty array', (done) => {
        chai.request(server)
          .get('/api/images') 
          .end((err, res) => {
            res.body.should.be.a('array');
            res.should.have.status(200);
            res.body.length.should.be.eql(0);
            done();
          });
      });
    })
    


})