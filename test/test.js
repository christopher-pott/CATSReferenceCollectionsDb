var should = require('chai').should();
var app = require("../app_mongo");
var request = require('supertest');
var db = require("../db_mongo");

var cookie;

/*sample*/
var reference_number = "testSample1234";
var sample_id = "5464ef0f9758a3100dea28c5";
var sample = { "_id" : sample_id, "paintLayer" : [ { "id" : "1", "layerType" : "", "paintBinder" : [ ], "colour" : "", "pigment" : "", "dye" : "", "active" : true } ], "sampleAnalysis" : [ { "id" : "1", "type" : "", "description" : "", "referenceNumber" : "", "date" : "", "employee" : "", "owner" : "", "originLocation" : "", "location" : "", "results" : "", "active" : true } ], "images" : [ ], "sampleType" : { "id" : "paint", "name" : "Paint Cross Section", "grp" : "Physical samples" }, "referenceNumber" : reference_number };
var unknown_sample_id = '5464efffff58a3100dea28c5';

/*artwork*/
var artwork_id = "5460ffffe6b9e5aa3ddffb9c";
var inventory_number = "KMSsp740xxx";
var artwork = { "_id" : artwork_id, "corpusId" : "1ba63e2f-4591-40f2-992f-9757fef6903a", "externalurl" : "http://cspic.smk.dk/globus/40412321/img0426.jpg", "inventoryNum" : inventory_number, "title" : "Portræt af en lutspiller", "productionDateEarliest" : "Tue Jan 01", "productionDateLatest" : "Thu Dec 31", "artist" : "Jan van Scorel, Hans Holbein d.Y., Christoph Amberger", "dimensions" : "44 x 32.5 cm", "nationality" : "Dutch, German, German", "technique" : "Oil on canvas, transferred from panel" };


/*user*/
var email = "test.user@smk.dk";
var unknown_email = "another.test.user@smk.dk";
var password = "test123";
var role = "default";
var default_credentials = {"username": email, "password": password, "role": role};
var user_no_pwd = {"username": email, "role": role};
var user_empty_pwd = {"username": email, "password": '', "role": role};
var admin_credentials = {username:'admin@smk.dk', password:'admin'}; /*this is the default but should have been changed*/

describe('Server Route Tests', function(){

    describe("POST user ", function() {
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated POST rejected', function(done){
            request(app)
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
            request(app)
              .post('/login')
              .send(admin_credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('create user attempt with missing password', function(done){
            request(app)
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
        it('create user attempt with empty password', function(done){
            request(app)
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
        it('create a new user', function(done){
            request(app)
            .post('/user')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(default_credentials) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(200);
                done();
            });
        });
        it('check the new user exists on the db', function(done){
            db.users.find({"username": email}).toArray(function(err, users) {
                if(err){throw err;}
                users.length.should.equal(1);
                done();
            })
        });
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('login',function(done){  
            request(app)
              .post('/login')
              .send(default_credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('non admin user attmepts to change another users password', function(done){
            request(app)
            .post('/user')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(admin_credentials) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(401);
                done();
            });
        });
        it('non admin user changes own password', function(done){
            request(app)
            .post('/user')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(default_credentials) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(200);
                done();
            });
        });        
    });
    describe("DELETE user ", function() {
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated DELETE rejected', function(done){
            request(app)
                .delete('/user')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(app)
              .post('/login')
              .send(admin_credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('delete unknown user', function(done){
            request(app)
                .delete('/user?username=' + unknown_email)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200); //is successful, even if resource is not found
                    done();
                });
        });
        it('delete user attempt with missing query', function(done){
            request(app)
                .delete('/user')
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400); 
                    done();
                });
        });
        it('delete test user', function(done){
            request(app)
                .delete('/user?username=' + email)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });        
        it('check user has been removed', function(done){
            db.users.find({"username": email}).toArray(function(err, users) {
                if(err){throw err;}
                users.length.should.equal(0);
                done();
            })
        });  
    });
    describe("POST sample ", function() {
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated POST rejected', function(done){
            request(app)
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
            request(app)
              .post('/login')
              .send(admin_credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('create sample attempt with no body', function(done){
            request(app)
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
        it('create sample attempt with a bad _id', function(done){
            request(app)
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
            request(app)
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
        it('check that sample exists on db', function(done){
            db.samples.find({"referenceNumber": reference_number}).toArray(function(err, samples) {
                if(err){throw err;}
                samples.length.should.equal(1);
                done();
            })
        });  
    });
    describe("DELETE sample ", function() {
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated DELETE rejected', function(done){
            request(app)
                .delete('/sample')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(app)
              .post('/login')
              .send(admin_credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('delete attempt on unknown sample', function(done){
            request(app)
                .delete('/sample?id=' + unknown_sample_id)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200); //is successful, even if resource is not found
                    done();
                });
        });
        it('delete sample attempt with missing query', function(done){
            request(app)
                .delete('/sample')
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400); 
                    done();
                });
        });
        it('delete sample attempt with bad _id', function(done){
            request(app)
                .post('/sample?id=' + "bad id")
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send({"_id" : "this isn't hex" }) 
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    done();
                });
        });
        it('delete test sample', function(done){
            request(app)
                .delete('/sample?id=' + sample_id)
                .set('cookie', cookie)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });        
        it('check sample is removed', function(done){
            db.samples.find({"referenceNumber": reference_number}).toArray(function(err, samples) {
                if(err){throw err;}
                samples.length.should.equal(0);
                done();
            })
        }); 
    });
    describe("POST artwork ", function() {
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('un-authenticated POST rejected', function(done){
            request(app)
                .post('/artwork')
                .set('Content-Type', 'application/json')
                .send({})
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('login',function(done){  
            request(app)
              .post('/login')
              .send(admin_credentials)
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });
        it('create artwork attempt with no body', function(done){
            request(app)
                .post('/artwork')
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send({}) //missing body here
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    done();
                });
        });
        it('create artwork attempt with a bad _id', function(done){
            request(app)
                .post('/artwork')
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send({"_id" : "this isn't hex" }) 
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    done();
                });
        });
        it('create a test artwork', function(done){
            request(app)
            .post('/artwork')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .send(artwork) 
            .end(function(err, res) {
                if (err) { throw err; }
                res.status.should.equal(200);
                done();
            });
        });
        it('check that artwork exists on db', function(done){
            db.artworks.find({"inventoryNum": inventory_number}).toArray(function(err, artworks) {
                if(err){throw err;}
                artworks.length.should.equal(1);
                done();
            })
        });
    });
    describe("GET artwork ", function() {
        it('retrieve the test artwork by _id',function(done){  
            request(app)
              .get('/artwork?id=' + artwork_id)
              .set('cookie', cookie)
              .send()
              .end(function(err,res){
                res.body[0].inventoryNum.should.equal(inventory_number);
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
        it('retrieve the test artwork by inventory number',function(done){  
            request(app)
              .get('/artwork?invNum=' + inventory_number)
              .set('cookie', cookie)
              .send()
              .end(function(err,res){
                res.body[0].inventoryNum.should.equal(inventory_number);
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });        
        it('remove the test artwork from db (cleanup)', function(done){
            db.artworks.remove({"inventoryNum": inventory_number}, function(err, numberRemoved){
                if(err){throw err;}
                numberRemoved.n.should.equal(1);
                done();
            });
        });
        it('logout',function(done){  
            request(app)
              .post('/logout')
              .set('cookie', cookie)
              .send({})
              .end(function(err,res){
                res.status.should.equal(200);
                cookie = '';
                done();
            });
        });
    });
});

