/**
 * Module dependencies
 */

var express = require('express'),
    nodeExcel = require('excel-export'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    db = require("./db_mongo"),
    Q = require('q'),
    passport = require('passport');

var app = module.exports = express();

var LocalStrategy = require('passport-local').Strategy;

/**
 * Configuration
 */

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
/*Passport middleware : must be before 'router'*/
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
/*End Passport middleware*/
app.use(app.router);


/*temporary setup without database*/
var users = [
             { id: 1, username: 'bob@example.com', password: 'secret' },
             { id: 2, username: 'joe@example.com', password: 'birthday' }
         ];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

///*Passport strategy (local)*/
//passport.use(new LocalStrategy({
//        usernameField: 'email',
//        passwordField: 'password'
//    },
//    function(username, password, done) {
//        User.findOne({ username: username }, function (err, user) {
//            if (err) { return done(err); }
//            if (!user) {
//                return done(null, false, { message: 'Incorrect username.' });
//            }
//            if (!user.validPassword(password)) {
//                return done(null, false, { message: 'Incorrect password.' });
//            }
//            return done(null, user);
//        });
//    }
//));

//Use the LocalStrategy within Passport.
//Strategies in passport require a `verify` function, which accept
//credentials (in this case, a username and password), and invoke a callback
//with a user object.  In the real world, this would query a database;
//however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy( function(username, password, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {

        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
         })
        });
    }
));

/*Passport sessions*/
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//passport.deserializeUser(function(id, done) {
//    User.findById(id, function(err, user) {
//        done(err, user);
//    });
//});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

//development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

//production only
if (app.get('env') === 'production') {
    // TODO
}

/**
 * Define the Routes
 */

//serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

//JSON API
app.get('/api/name', api.name);

app.post('/login', 
        passport.authenticate('local'),
        function(req, res) {
            /*user is null if authentication failed*/
            res.send(req.user); 
        });

/**
 * Define a middleware function to be used for every secured routes 
 * See description at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
 */
//var auth = function(req, res, next){ 
//    if (!req.isAuthenticated()){
//        res.send(401); 
//    }else{
//        next(); 
//    }
//}
//
///**
// * route to test if the user is logged in or not 
// */
//app.get('/loggedin', function(req, res) {
//    res.send(req.isAuthenticated() ? req.user : '0');
//});
//
///** 
// * route to log in 
// **/
//app.post('/login', passport.authenticate('local'), function(req, res) {
//    res.send(req.user); 
//}); 
//
///**
// * route to log out 
// */ 
//app.post('/logout', function(req, res){ 
//    req.logOut(); res.send(200); 
//});

/**
 * Excel export (requires 'excel-export' module)
 */
//app.get('/Excel', function(req, res){
//    var conf ={};
//  // uncomment it for style example  
//  // conf.stylesXmlFile = "styles.xml";
//    conf.cols = [{
//        caption:'string',
//        captionStyleIndex: 1,        
//        type:'string',
//        beforeCellWrite:function(row, cellData){
//             return cellData.toUpperCase();
//        }
//        , width:15
//    },{
//        caption:'date',
//        type:'date',
//        beforeCellWrite:function(){
//            var originDate = new Date(Date.UTC(1899,11,30));
//            return function(row, cellData, eOpt){
//              // uncomment it for style example 
//              // if (eOpt.rowNum%2){
//                // eOpt.styleIndex = 1;
//              // }  
//              // else{
//                // eOpt.styleIndex = 2;
//              // }
//              if (cellData === null){
//                eOpt.cellType = 'string';
//                return 'N/A';
//              } else
//                return (cellData - originDate) / (24 * 60 * 60 * 1000);
//            } 
//        }()
//        , width:20.85
//    },{
//        caption:'bool',
//        type:'bool'
//    },{
//        caption:'number',
//        type:'number',
//        width:30
//    }];
//    conf.rows = [
//      ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14159],
//      ["e", new Date(2012, 4, 1), false, 2.7182],
//      ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
//      ["null date", null, true, 1.414]
//    ];
//  var result = nodeExcel.execute(conf);
//  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//  res.end(result, 'binary');
//});

app.get('/Excel', function(req, res){

    /*Search without limits*/
    var partialterm = req.query.partialterm;

    if (partialterm){
      
        db.samples.find({
            "$text": {
              "$search": partialterm
            }
        })
   /*   .limit(pageSize)  :  no limit - for reports we need all results*/
        .toArray(function(err, items) {

            var results = getArtworks(items);

            results.then(function(result){

                /*build excel sheet*/
                var body = result;
                var conf ={};
                conf.cols = [
                {
                    caption:'Sample Type',
                    type:'string',
                    width:20
                },{
                    caption:'Ref.num',
                    type:'string',
                    width:20
                },{
                    caption:'Sample origin',
                    type:'string',
                    width:20
                },{
                    caption:'Sample date',
                    type:'string',
                    width:20
                },{
                    caption:'Institution',
                    type:'string',
                    width:30
                },{
                    caption:'Employee',
                    type:'string',
                    width:20
                },{
                    caption:'Sample location',
                    type:'string',
                    width:20
                },{
                    caption:'Remarks',
                    type:'string',
                    width:30
                },{
                    caption:'Fibre type(s)',
                    type:'string',
                    width:30
                },{
                    caption:'Fibre glue',
                    type:'string',
                    width:30
                },{
                    caption:'(Fibre) Ligin',
                    type:'string',
                    width:10
                },{
                    caption:'(Fibre) Alum',
                    type:'string',
                    width:10
                },{
                    caption:'(Fibre) Filler',
                    type:'string',
                    width:10
                },{
                    caption:'Material type(s)',
                    type:'string',
                    width:30
                },{
                    caption:'(Paint) Priming',
                    type:'string',
                    width:15
                },{
                    caption:'Paint layers description',
                    type:'string',
                    width:30
                },{
                    caption:'Paint layers',
                    type:'string',
                    width:30
                },{
                    caption:'(Pigment) Colour Classification',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Source',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Production no./Batch no.',
                    type:'string',
                    width:30
                },{
                    caption:'(Pigment) Secondary provenance',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Place of origin',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Chemical composition',
                    type:'string',
                    width:20
                },{
                    caption:'Pigment name',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Other names',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Form',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Production date',
                    type:'string',
                    width:20
                },{
                    caption:'(Pigment) Container',
                    type:'string',
                    width:20
                },{
                    caption:'Stretcher type',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Material type',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Condition',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Joint technique',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Dimensions',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Production earliest',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Production date latest',
                    type:'string',
                    width:20
                },{
                    caption:'(Stretcher) Source',
                    type:'string',
                    width:20
                },{
                    caption:'Sample Analysis',
                    type:'string',
                    width:30
                },{
                    caption:'Artwork Inventory Num.',
                    type:'string',
                    width:20
                }];

                conf.rows = [];
                for (i = 0; i<body.length; i++){
                    var ii = 0;
                    /*shared fields */
                    conf.rows[i] = [];
                    conf.rows[i][ii++] = body[i].sampleType.name;
                    conf.rows[i][ii++] = body[i].referenceNumber;
                    conf.rows[i][ii++] = (body[i].originLocation) ? body[i].originLocation : null;
                    conf.rows[i][ii++] = (body[i].sampleDate) ? body[i].sampleDate : null;
                    conf.rows[i][ii++] = (body[i].owner && body[i].owner.name) ? body[i].owner.name : null;
                    conf.rows[i][ii++] = (body[i].employee) ? body[i].employee : null;
                    conf.rows[i][ii++] = (body[i].sampleLocation) ? body[i].sampleLocation : null;
                    conf.rows[i][ii++] = (body[i].remarks) ? body[i].remarks : null;
                    
                    /*paper fields*/
                    conf.rows[i][ii++] = (body[i].fibreType) ? body[i].fibreType.map(function(elem){return elem.name;}).join(", ") : null;
                    conf.rows[i][ii++] = (body[i].fibreGlue) ? body[i].fibreGlue.map(function(elem){return elem.name;}).join(", ") : null;
                    conf.rows[i][ii++] = (body[i].fibreLigin) ? true : null;
                    conf.rows[i][ii++] = (body[i].fibreAlum) ? true : null;
                    conf.rows[i][ii++] = (body[i].fibreFiller) ? true : null;
                    
                    /*material fields*/
                    conf.rows[i][ii++] = (body[i].materialType) ? body[i].materialType.map(function(elem){return elem.name;}).join(", ") : null;
                    
                    /*paint fields*/
                    conf.rows[i][ii++] = (body[i].paintPriming) ? true : null;
                    conf.rows[i][ii++] = (body[i].paintLayerDescription) ? body[i].paintLayerDescription : null;
                    conf.rows[i][ii++] = (body[i].paintLayer && body[i].paintLayer[0].layerType.name) ? 
                        body[i].paintLayer.map(function(elem){
                            /*format all layer data for a single cell*/
                            var layer = "";
                            var binders = (elem.paintBinder) ? elem.paintBinder.map(function(elem){return elem.name;}).join(", ") : "";
                            var colours = (elem.colour) ? elem.colour.map(function(elem){return elem.name;}).join(", ") : "";
                            var pigments = (elem.pigment) ? elem.pigment.map(function(elem){return elem.name;}).join(", ") : "";
                            var dyes = (elem.dye) ? elem.dye.map(function(elem){return elem.name;}).join(", ") : "";
                            
                            layer = elem.layerType.name + " layer" +
                                    "\n  Binders: " + binders +
                                    "\n  Colours: " + colours +
                                    "\n  Pigments: " + pigments +
                                    "\n  Dyes: " + dyes;
                            
                            return layer;
                        }).join("\n\n") : null;

                    /*pigment fields*/
                    conf.rows[i][ii++] = (body[i].pigmentColourClass && body[i].pigmentColourClass.name) ? body[i].pigmentColourClass.name : null;
                    conf.rows[i][ii++] = (body[i].pigmentSource) ? body[i].pigmentSource : null;
                    conf.rows[i][ii++] = (body[i].pigmentProdNumber) ? body[i].pigmentProdNumber : null;
                    conf.rows[i][ii++] = (body[i].pigmentSecondryProvenance) ? body[i].pigmentSecondryProvenance : null;
                    conf.rows[i][ii++] = (body[i].pigmentOrigin) ? body[i].pigmentOrigin : null;
                    conf.rows[i][ii++] = (body[i].pigmentComposition) ? body[i].pigmentComposition : null;
                    conf.rows[i][ii++] = (body[i].pigmentName && body[i].pigmentName.name) ? body[i].pigmentName.name : null;
                    conf.rows[i][ii++] = (body[i].pigmentOtherName) ? body[i].pigmentOtherName : null;
                    conf.rows[i][ii++] = (body[i].pigmentForm && body[i].pigmentForm.name) ? body[i].pigmentForm.name : null;
                    conf.rows[i][ii++] = (body[i].productionDate) ? body[i].productionDate : null;
                    conf.rows[i][ii++] = (body[i].pigmentContainer && body[i].pigmentContainer.name) ? body[i].pigmentContainer.name : null;

                    /*stretcher fields*/
                    conf.rows[i][ii++] = (body[i].stretcherType) ? body[i].stretcherType.map(function(elem){return elem.name;}).join(", ") : null;
                    conf.rows[i][ii++] = (body[i].stretcherMaterialType) ? body[i].stretcherMaterialType.map(function(elem){return elem.name;}).join(", ") : null;
                    conf.rows[i][ii++] = (body[i].stretcherCondition && body[i].stretcherCondition.name) ? body[i].stretcherCondition.name : null;
                    conf.rows[i][ii++] = (body[i].stretcherJointTechnique) ? body[i].stretcherJointTechnique.map(function(elem){return elem.name;}).join(", ") : null;
                    conf.rows[i][ii++] = (body[i].stretcherDimensions) ? body[i].stretcherDimensions : null;
                    conf.rows[i][ii++] = (body[i].stretcherProductionDateEarliest) ? body[i].stretcherProductionDateEarliest : null;
                    conf.rows[i][ii++] = (body[i].stretcherProductionDateLatest) ? body[i].stretcherProductionDateLatest : null;
                    conf.rows[i][ii++] = (body[i].stretcherSource) ? body[i].stretcherSource : null;

                    /*analysis field*/
                    conf.rows[i][ii++] = (body[i].sampleAnalysis && body[i].sampleAnalysis[0].type) ? body[i].sampleAnalysis.map(function(elem){return elem.type.name;}).join(", ") : null;

                    /*artwork field*/
                    conf.rows[i][ii++] = (body[i].artwork && body[i].artwork.inventoryNum) ? body[i].artwork.inventoryNum : null;
                }
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(result, 'binary');

            }, function (err) {
                /*this is called if any of the promises have failed */
                console.error(err); 
            });
        });
    }
});

/**
 * SEARCH operations
 */

/*
 * Proxy to SMKs collectionspace solr instance as browser rejects cross origin
 * requests. Response can be chunked, so we pipe all chunks back to the client.
 *
 * Usage : searchsmk?id=KMS1
 */
app.get('/searchsmk', function(req, res) {
    var id = req.query.id;
    var options = {
        host: 'csdev-seb',
        port: 8180,
        path: '/solr-example/dev_cats/select?q=id%3A' + id + '&wt=json&indent=true',
//        path: '/solr-example/preprod_all_dk/select?q=id_s%3A%22' + id +
//              '%22&wt=json&indent=true',
        method: 'GET'
    };
    var proxy = http.request(options, function (resp) {
        resp.pipe(res, {
            end: true
        });
    });
    proxy.on('error', function(err) {
        // Solr is down or otherwise not visible
        console.log("couldn't contact solr");
        res.statusCode = 502; //"502 : Bad Gateway" seems appropriate
        res.send();
    });
    req.pipe(proxy, {
        end: true
    });
    
});

/*
 * Uses text index and mongo full text search
 * 
 * Usage: 1. search?type=sample&owner=smk
 *        2. search?type=sample&partialterm=smk 
 */
app.get('/search', function(req, res) {
   
    var searchType = req.query.type;
    
    if(searchType === 'sample'){

        var partialterm = req.query.partialterm;

        if (partialterm){

            db.samples.find({
                "$text": {
                  "$search": partialterm
                }
            }).toArray(function(err, items) {
                res.send(items);
            })
        }
    }
});

/*
 * For an array of samples, fetch the related artwork.
 * 
 */
function getArtworks(samples) {
    
    /* define the array of promises required by Q.all() as input */
    var promises = [];  

    /* A regular for loop didn't work here*/
    samples.forEach(function(sample) {
        
        /* use Q.defer() to create a deferred. Deferred is used to
         * implement custom methods returning promises*/
        var deferred = Q.defer();

        if (sample.artwork_id){

            /*'find' requires this format for _id*/
            var id = db.ObjectId(sample.artwork_id); 

            /*query database for the artwork*/
            db.artworks.find({"_id" : id}).toArray(function(err, artworks) {

                sample.artwork = artworks[0];
                /* Calling resolve with a non-promise value causes promise to be 
                 * fulfilled with that value */
                deferred.resolve(sample);
            });
        }else{
            /*we still need the sample in the results even if there's no artwork*/
            deferred.resolve(sample);
        }
        /*add to promises array*/
        promises.push(deferred.promise);
    })
    /* when all are promises are resolved, return the results */
    return Q.all(promises);
  }

/*
 * Uses text index and mongo full text search
 * 
 * Usage: 1. search?type=sample&partialterm=smk&pageNum=1&pageSize=50
 */
app.get('/newSearch', function(req, res) {

    var searchType = req.query.type;

    if(searchType === 'sample'){
        
        var partialterm = req.query.partialterm;
//        var pageNum = req.query.pageNum;
        var pageSize = parseInt(req.query.pageSize); /*limit() requires int*/

        if (partialterm){
            
            db.samples.find({
                "$text": {
                  "$search": partialterm
                }
            })
            //.skip(pageNum > 0 ? ((pageNum-1)*pageSize) : 0)
            .limit(pageSize)
            .toArray(function(err, items) {

                var results = getArtworks(items);

                results.then(function(result){
                    /*this is called when all promises in getArtworks have completed*/
                    console.log(result);
                    res.send(result);
                }, function (err) {
                    /*this is called if any of the promises have failed */
                    console.error(err); 
                });
            });
        }
    }
});

/*
 * Returns the size of the search results
 * 
 * Usage: 1. search?type=sample&partialterm=smk
 */
app.get('/newSearchSize', function(req, res) {

    var searchType = req.query.type;

    if(searchType === 'sample'){

        var partialterm = req.query.partialterm;

        if (partialterm){

            db.samples.find({
                "$text": {
                  "$search": partialterm
                }
            })
            .count(function(err, count) {
                console.log("searchSize: " + count);
                /* if you pass an integer, express framework will use it to set the
                 * HTTP status code. To avoid this, we need to cast it to a string */
                res.send(count.toString());
            });
        }
    }
});

/**
 * SAMPLE operations
 */

/* This will create or update the record depending on the existence of
 * the "_id" parameter in the body
 */
app.post('/sample', function(req, res) {

    var body = req.body;

    /* MongoDB creates _id as an ObjectID, but doesn't retrieve _id as an ObjectID, so
     * we have to recreate it each time. Somehow, this seems to work.
     */
    body._id = db.ObjectId(body._id);
    var query = {'_id' : body._id };
    var options = { 'upsert': true };

    db.samples.update(query, body, options, function (err, upserted) {
        if (err || !upserted){
            console.log(body.sampleType + " not saved");
            throw err;
        } else {
            console.log('upsert successful ');
            res.send(upserted);
        }
    });
});

app.put('/sample', function(req, res) {
    
    var sampleId = req.query.id;
    var body = req.body;
    /* if _id is present, record will be updated
     * 
     * NOTE: This command is dropped as post does an upsert
     */
});

/*
 * Sample options : DELETE will fail with 404 if the browser uses CORS and
 * sends an OPTIONS request which doesn't get answered
 */
app.options('/sample', function(req, res){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    res.end();
});

app.delete('/sample', function(req, res){

    /* If successful returns the number of deleted records
     */
    var id = db.ObjectId(req.query.id);
    console.log("DELETE " + id);
    db.samples.remove({"_id": id}, function(err, numberRemoved){
        if (err || !numberRemoved){
            console.log("delete failed");
            res.send(err); //send calls res.end()
//            throw err;
        } else {
            console.log("delete successful");
            res.send(numberRemoved);
        }
    });
});

/**
 * ARTWORK operations
 */
/*this uses update, which won't return the new object id
app.post('/artwork', function(req, res){
    
    var body = req.body;
    console.log(body);

    /* MongoDB creates _id as an ObjectID, but doesn't retrieve _id as an ObjectID, so
     * we have to recreate it each time. Somehow, this seems to work.
     
    body._id = db.ObjectId(body._id);
    var query = {'_id' : body._id };
    var options = { 'upsert': true };

    db.artworks.update(query, body, options, function (err, upserted) {
        if (err || !upserted){
            console.log("artwork " + body.title + " not saved");
            throw err;
        } else {
            console.log('artwork upsert successful ');
            res.send(upserted);
        }
    });
});*/

/* Updates or inserts (upserts) a new artwork record in mongodb using mongojs.
 * Returns the record _id.
 * */
app.post('/artwork', function(req, res){

    var body = req.body;

    /* MongoDB creates _id as an ObjectID, but doesn't retrieve _id as an ObjectID, so
     * we have to recreate it each time for the query.
     */
    body._id = db.ObjectId(body._id);
    var options = {};
    options.query = {'_id' : body._id};  /*query by _id*/
    options.upsert = true;               /*if query doesn't find a record then insert a new one */
    options.new = true;                  /*return the modified document (not the original)*/
    options.fields = {_id: 1};           /*define fields for the returned document: just the id*/
    options.update = {$set: body};       /*data to write to the record*/

    /* findAndModify() can upsert a single record and return the new record _id, which update()
     * cannot*/
    db.artworks.findAndModify(options, function (err, record, lastErr) {
        if (err || !record){
            console.log("artwork " + body.title + " not saved");
            throw err;
        } else {
            console.log('artwork upsert successful, _id: ' + record._id);
            res.send(record);
        }
    });
});

app.get('/artwork', function(req, res) {

    var invNum = req.query.invNum;
    var id = db.ObjectId(req.query.id);
    
    if (invNum){
        console.log("get artwork by invNum: " + invNum);

        db.artworks.find({"inventoryNum" : invNum})
        .toArray(function(err, items) {
            res.send(items);
        })
    }else if (id){
        console.log("get artwork by id: " + id);

        db.artworks.find({"_id" : id})
        .toArray(function(err, items) {
            res.send(items);
        })
    }
});

/**
 * RECORD operations
 */


//redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
