var should = require('chai').should();
var request = require('supertest');

var cookie;
var sample_id = '5464ef0f9758a3100dea28c5';
var unknown_sample_id = '5464efffff58a3100dea28c5';

describe('Test Routes', function(){
    
    var url = 'http://localhost:3000';
    var sample = { "_id" : sample_id, "paintLayer" : [ { "id" : "1", "layerType" : "", "paintBinder" : [ ], "colour" : "", "pigment" : "", "dye" : "", "active" : true } ], "sampleAnalysis" : [ { "id" : "1", "type" : "", "description" : "", "referenceNumber" : "", "date" : "", "employee" : "", "owner" : "", "originLocation" : "", "location" : "", "results" : "", "active" : true } ], "images" : [ ], "sampleType" : { "id" : "paint", "name" : "Paint Cross Section", "grp" : "Physical samples" }, "referenceNumber" : "12345" };
    var email = "test.user@smk.dk";
    var unknown_email = "another.test.user@smk.dk";
    var password = "test123";
    var role = "default";
    var user = {"username": email, "password": password, "role": role};
    var user_no_pwd = {"username": email, "role": role};
    var user_empty_pwd = {"username": email, "password": '', "role": role};
    var credentials = {username:'admin@smk.dk', password:'admin'}; /*this is the default but should have been changed*/

    describe("POST user ", function() {
        it('logout',function(done){  
            request(url)
              .post('/logout')
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated POST rejected', function(done){
            request(url)
                .post('/user')
                .set('Content-Type', 'application/json')
                .send({})
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(url)
              .post('/login')
              .send(credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('create user missing password', function(done){
            request(url)
            .post('/user')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(user_no_pwd) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(400);
                done();
            });
        });
        it('create user empty password', function(done){
            request(url)
            .post('/user')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(user_empty_pwd) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(400);
                done();
            });
        });
        it('create user', function(done){
            request(url)
            .post('/user')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(user) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(200);
                done();
            });
        });
    });
    describe("DELETE user ", function() {
        it('logout',function(done){  
            request(url)
              .post('/logout')
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated DELETE rejected', function(done){
            request(url)
                .delete('/user')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(url)
              .post('/login')
              .send(credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('delete test user', function(done){
            request(url)
                .delete('/user?username=' + email)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
        it('delete unknown user', function(done){
            request(url)
                .delete('/user?username=' + unknown_email)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200); //is successful, even if resource is not found
                    done();
                });
        });
    });
    describe("POST sample ", function() {
        it('logout',function(done){  
            request(url)
              .post('/logout')
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated POST rejected', function(done){
            request(url)
                .post('/sample')
                .set('Content-Type', 'application/json')
                .send({})
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(url)
              .post('/login')
              .send(credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('no body', function(done){
            request(url)
                .post('/sample')
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send({}) //missing body here
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    done();
                });
        });
        it('non hex _id', function(done){
            request(url)
                .post('/sample')
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send({"_id" : "this isn't hex" }) 
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    done();
                });
        });
        it('create test sample', function(done){
            request(url)
            .post('/sample')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(sample) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(200);
                done();
            });
        });
    });
    describe("DELETE sample ", function() {
        it('logout',function(done){  
            request(url)
              .post('/logout')
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated DELETE rejected', function(done){
            request(url)
                .delete('/sample')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(url)
              .post('/login')
              .send(credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('delete test sample', function(done){
            request(url)
                .delete('/sample?id=' + sample_id)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
        it('delete unknown sample', function(done){
            request(url)
                .delete('/sample?id=' + unknown_sample_id)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200); //is successful, even if resource is not found
                    done();
                });
        });
    });
});
