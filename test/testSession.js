var supertest = require('supertest');
var assert = require('assert');
var expect = require('Chai').expect;
var async = require('async');

var sys = require('sys');
var exec = require('child_process').exec;

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./hosts.json'));

var api = supertest(data.appB);
var apiExpected = supertest(data.appA);

describe('testing session protected API', function() {

    it(', fail the login with bad password (curl)', function(done) {
        command = 'curl --data "username=admin&password=badpass" http://localhost:5000/session/login';
        var sys = require('sys')
        var exec = require('child_process').exec;
        exec(command, function(error, stdout, stderr) {
            if(error) {
                done(error);
            } else {
                expect(stdout).to.equal('{"message":"Bad username or password"}');
                done();
            }
        });
    });

    it(', fail the login with bad password (post via node)', function(done) {
        apiExpected
        .post('/session/login')
        .send({ username: 'admin', password: 'badpass' })
        .expect(401)
        .end(function(err, res){
            if(err) {
                done(err);
            } else {
                expect(res.text).to.be.equal('{"message":"Bad username or password"}');
                done();
            }
        });
    });

    it(', do the login with good password (curl)', function(done) {
        command = 'curl --data "username=admin&password=pass" http://localhost:5000/session/login';
        var sys = require('sys')
        var exec = require('child_process').exec;
        exec(command, function(error, stdout, stderr) {
            if(error) {
                done(error);
            } else {
                var goodresult = '{"id":0,"username":"admin","password":"4ddf3f61c0c2d465dd949cc9fdb4899b02d933d4b2ddb0debb5ec42b9f630999","salt":"foo","role":"ADMIN"}';
                expect(stdout).to.equal(goodresult);
                done();
            }
        });
    });

    it(', do the login with good password (post via node)', function(done) {
        apiExpected
        .post('/session/login')
        .send({ username: 'admin', password: 'pass' })
        .expect(200)
        .end(function(err, res){
            if(err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it(', expect appB can do the login', function(done) {
        api
        .get('/session/login')
        .expect(200)
        .end(function(err, res){
            if(err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it(', expect appB can authenticate after the login', function(done) {
        api
        .get('/session/login')
        .expect(200)
        .end(function(err, res){
            if(err) {
                done(err);
            } else {

                api
                .get('/session/users')
                .expect(200)
                .end(function(err, res){
                    if(err) {
                        done(err);
                    } else {
                        expect(res.text).to.be.equal('{"color":"rgb(242,192,112)"}');
                        done();
                    }
                });
            }
        });
    });

    it(', do the right things with the cookie saved (curls)', function(done) {   
        async.series(
            [
                function(callback) {
                    command = 'rm -f jarfile';
                    exec(command, function(error, stdout, stderr) {
                        if(error) {
                            done(error);
                        } else {
                            callback(null, stdout);
                        }
                    });
                },
                function(callback) {
                    command = 'curl --cookie-jar jarfile --data "username=admin&password=pass" '+data.appA+'/session/login';
                    exec(command, function(error, stdout, stderr) {
                        if(error) {
                            done(error);
                        } else {
                            callback(null, stdout);
                        }
                    });
                }, 
                function(callback) {
                    command = 'curl --cookie jarfile "'+data.appA+'/session/admin"';
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
                expect(r[2]).to.be.equal('{"color":"rgb(0, 106, 173)"}');
                done();
            }
        );
    });

    // it(', do the right things with the cookie saved (node)', function(done) {   
    //     async.series(
    //         [
    //             function(callback) {
    //                 command = 'rm -f jarfile';
    //                 exec(command, function(error, stdout, stderr) {
    //                     if(error) {
    //                         done(error);
    //                     } else {
    //                         callback(null, stdout);
    //                     }
    //                 });
    //             },
    //             function(callback) {
    //                 command = 'curl --cookie-jar jarfile --data "username=admin&password=pass" '+data.appA+'/session/login';
    //                 exec(command, function(error, stdout, stderr) {
    //                     if(error) {
    //                         done(error);
    //                     } else {
    //                         callback(null, stdout);
    //                     }
    //                 });
    //             }, 
    //             function(callback) {
    //                 command = 'curl --cookie jarfile "'+data.appA+'/session/admin"';
    //                 exec(command, function(error, stdout, stderr) {
    //                     if(error) {
    //                         done(error);
    //                     } else {
    //                         callback(null, stdout);
    //                     }
    //                 });
    //             }

    //         ], 
    //         function(e, r) {
    //             expect(r[2]).to.be.equal('{"color":"rgb(0, 106, 173)"}');
    //             done();
    //         }
    //     );
    // });

});