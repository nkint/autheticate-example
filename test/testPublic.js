var supertest = require('supertest');
var assert = require('assert');
var expect = require('Chai').expect;
var async = require('async');

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./hosts.json'));

var api = supertest(data.appB);
var apiExpected = supertest(data.appA);

describe('testing public API', function() {
  it(', should be the same', function(done) {

    async.parallel([
        function(callback) {
            api.get('/public/test')
            .expect(200)
            .end(function(err, res){
                if(err) {
                  done(err);
                } else {
                  callback(null, res.text);
                }
              });
        },
        function(callback) {
            apiExpected.get('/public/test')
            .expect(200)
            .end(function(err, res){
                if(err) {
                  done(err);
                } else {
                  callback(null, res.text);
                }
              });
        },

    ], function(e, r) {
        expect(r[0]).to.be.equal(r[1]);
        done();
    });
  });
});