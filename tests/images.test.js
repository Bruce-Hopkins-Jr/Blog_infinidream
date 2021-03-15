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

Image.remove({}, (err) => {});
describe('Images', () => {

    describe('/GET all images', () => {
        it('it should get 200', (done) => {
          chai.request(server)
            .get('/api/images')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    })

    describe('/GET image', () => {
        it('it should get 200', (done) => {
          chai.request(server)
            .get('/api/image/thisname')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    })
    let name = {
      name: "ThisImage"
    }
    describe('/POST image', () => {
        it('it should get 200', (done) => {
          chai.request(server)
            .post('/api/create-image')
            .field('Content-Type', 'multipart/form-data')
            .field(name)
            .attach('image', 'tests/exampleposts/Section.jpeg')
            .end((err, res) => {
              res.should.have.status(200);
              console.log(res.text)
              
              res.on('error', err => {
                console.error(err)
              })
              done();
            });
        });
    })

    describe('/DELETE image', () => {
        it('it should get 200', (done) => {
          chai.request(server)
            .post('/api/image/thisname/delete')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    })


})