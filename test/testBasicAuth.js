var supertest = require('supertest');
var assert = require('assert');
var expect = require('Chai').expect;
var async = require('async');

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./hosts.json'));

var api = supertest(data.appB);
var apiExpected = supertest(data.appA);

describe('testing basic auth protected API', function() {

  it(', should be Unathorized', function(done) {
    apiExpected.get('/basicauth/test')
    .expect(401)
    .end(function(err, res) {
        if(err) {
            done(err);
        } else {
            expect(res.text).to.be.equal('Unauthorized');
            done();
        }
    });
  });

  it(', appA not should authenticate with wrong password', function(done){

    apiExpected.get('/basicauth/test')
    .auth('admin', 'a bad password')
    .expect(401)
    .end(function(err, res) {
        if(err) {
            done(err);
        } else {
            done();
        }
    });
  });

  it(', appA should authenticate', function(done){
    apiExpected.get('/basicauth/test')
    .auth('admin', data.passAdmin)
    .expect(200)
    .end(function(err, res) {
        if(err) {
            done(err);
        } else {
            done();
        }
    });
});

  it(', appB and appA should be the same', function(done) {

    async.parallel(
        [
        function(callback) {
            api.get('/basicauth/test')
            .expect(200)
            .end(function(err, res) {
                if(err) {
                    done(err);
                } else {
                    callback(null, res.text);
                }
            });
        },
        function(callback) {
            apiExpected.get('/basicauth/test')
            .expect(200)
            .auth('admin', data.passAdmin)
            .end(function(err, res) {
                if(err) {
                    done(err);
                } else {
                    callback(null, res.text);
                }
            });
        },

        function(callback) {
            command = 'curl -u admin:'+data.passAdmin+' "'+data.appA+'/basicauth/test"';
            var sys = require('sys')
            var exec = require('child_process').exec;
            exec(command, function(error, stdout, stderr) {
                if(error) {
                    done(error);
                } else {
                    callback(null, stdout);
                }
            });
        }

        ], 
        function(e, r) {
            expect(r[0]).to.be.equal(r[1]);
            expect(r[0]).to.be.equal(r[2]);
            done();
        }
    );
});

});