let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();

var Posts = require('../models/postsModel')
var server = require('../app');

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

