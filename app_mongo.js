/**********************
 * Module dependencies
 **********************/

var express = require('express'),
    fs = require('fs'),
    nodeExcel = require('excel-export'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    db = require("./db_mongo"),
    Q = require('q'),
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10,
    passport = require('passport');

var app = module.exports = express();

/****************
 * Configuration
 ****************/

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

//development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

//production only
if (app.get('env') === 'production') {
  // TODO
}

/**************************
 * Passport authentication 
 **************************/

var LocalStrategy = require('passport-local').Strategy;

//Bcrypt middleware : return hashed password 
function encrypt(password, next) {

	/*if(!user.isModified('password')) return next();*/

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		/*hash(pswd, salt, progress(), callback())*/
		bcrypt.hash(password, salt, null, function(err, hash) { 
			if(err) return next(err, null);
			password = hash;
			return next(null,password);
		});
	});
};

function findById(id, fn) {
	
    var _id = db.ObjectId(id);
	
	db.users.find({"_id": _id}).toArray(function(err, users) {
		if(err || !users){return fn(err, null);}
		if(users){return fn(null, users[0]);}
    });
}

function findByUsername(username, fn) {

	db.users.find({"username": username}).toArray(function(err, users) {
		if(err || !users){return fn(err, null);}
		if(users){return fn(null, users[0]);}
    });
}

/*Passport strategy (local) Used when authenticating*/
passport.use(new LocalStrategy( function(username, password, done) {

    /* Find the user by username.  If there is no user with the given username
       or the password is not correct then return an error, otherwise, return the
       authenticated user*/
    findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        
        /* compare password with the hash */
    	bcrypt.compare(password, user.password, function(err, isMatch) {
    		if(err || !isMatch)  return done(null, false, { message: 'Incorrect password.' });
    		return done(null, user);
    	});
 	})
}));

/*Passport sessions*/
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

/*Passport authentication Routes*/

/* login */
app.post('/login', passport.authenticate('local'), function(req, res) {
    /*user is null if authentication failed*/
    res.send(req.user); 
});

/* log out */ 
app.post('/logout', function(req, res){ 
	req.logOut(); 
	res.send(200); 
});

/* route to test if the user is logged in or not */
app.get('/loggedin', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
});

/********************
 * Define the Routes
 ********************/

/* index and view partials */
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

/* JSON API */
app.get('/api/name', api.name);




function buildSampleQuery(req) {
    
    var fullText = req.query.fulltext;
    var sampleType = req.query.sampletype;
    /*date query requires ISO strings*/
    var startDate = (req.query.startdate) ? new Date(req.query.startdate).toISOString().replace(/T.*Z/, '') : null;
    var endDate = (req.query.enddate) ? new Date(req.query.enddate).toISOString().replace(/T.*Z/, '') : null;
    /*ignore time as artwork date times are not relevant : 
     * if just a year is selected in datepicker, the time is set to 00:00:00
     * if a date is selected the time is localized, which means the year could be the
     * previous year if 01/01/yyyy is used.
     * Need to test if datepicker is used: does this still work*/

    var query = {};
    var filters = [];
    
    /* Build the following query:
     * 
     * db.samples.find({$and:[{$or: [{"productionDate" : {$lte: endDate}}, {"artwork.productionDateEarliest" : {$lte: endDate}}]},
     *                        {$or: [{"productionDate" : {$gte: startDate}}, {"artwork.productionDateLatest" : {$gte: startDate}}]},
     *                        {"sampleType.name": sampletype},
     *                        {"$text": {"$search": fulltext}
     *                       }]
     *                 })
     */
    if (fullText){filters.push({"$text" : {"$search": fullText}});}
    if (sampleType){filters.push({"sampleType.name": sampleType});}
    /* searches by date should use the related artwork date, except for pigments
     * which have their own production dates (named productionDate)
     * */
    if (endDate){
        filters.push({$or: [{"productionDate" : {$lte: endDate}}, {"artwork.productionDateEarliest" : {$lte: endDate}}]});
    }
    if (startDate){
        filters.push({$or: [{"productionDate" : {$gte: startDate}}, {"artwork.productionDateLatest" : {$gte: startDate}}]});
    }
    /*apply AND operation to any filters*/
    if(filters.length){
        query.$and = filters;
    }
    return query;
}

/* Excel export (requires 'excel-export' module)*/
app.get('/Excel', function(req, res){

    /*Search without limits*/
    var query = buildSampleQuery(req);
    
    db.samples.find(query)
    .toArray(function(err, items) {

        if(err || !items){
        	console.error(err);
        	res.end();
        }
        
        if(items){
            /*build excel sheet*/
            var body = items;
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
                conf.rows[i][ii++] = (body[i].referenceNumber) ? body[i].referenceNumber : null;
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
        }
    });
});

/**********************
 * SEARCH operations
 **********************/
/*
 * Search Corpus(solr) for SMK artworks
 * 
 * Proxy to SMKs collectionspace solr instance as browser rejects cross origin
 * requests. Response can be chunked, so we pipe all chunks back to the client.
 *
 * Usage : searchsmk?id=KMS1
 */
app.get('/searchsmk', function(req, res) {
    var id = req.query.id;
    var options = {
        host: 'solr.smk.dk',           //'csdev-seb',
        port: 8080,                    // 8180,
        path: '/solr/prod_CATS/' +     //'/solr-example/dev_cats/
              'select?q=id_s%3A' + id + '&wt=json&indent=true',  /*id_s also works on verso & multiworks*/
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
        res.send(502);  //"502 : Bad Gateway"
    });
    req.pipe(proxy, {
        end: true
    });
});

/*
 * Now REDUNDANT.... but kept because it may be useful later
 * and it's an example of promises.
 * 
 * For an array of samples, fetch the related artwork.
 * Uses promises to simulate a synchronous interface.
 * 
 * Usage:
 *               var results = getArtworks(items);
 *
 *                results.then(function(result){
 *                    //this is called when all promises in getArtworks have completed
 *                    console.log(result);
 *                    res.send(result);
 *                }, function (err) {
 *                    //this is called if any of the promises have failed 
 *                    console.error(err); 
 *               });
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
 * Uses text index and mongo full text search to retrieve a list of samples
 * Also fetches and appends the related artworks.
 * 
 * Usage: 1. search?type=sample&fulltext=blue&sampletype=Paint%20Cross%20Section&startDate=&endDate==&pageNum=1&pageSize=50
 */
app.get('/search', function(req, res) {

    var searchType = req.query.type;
  /*var pageNum = req.query.pageNum;*/
    var pageSize = parseInt(req.query.pageSize); /*limit() requires int*/

    if(searchType === 'sample'){
        
        var query = buildSampleQuery(req);
        
        db.samples.find(query)
        //.skip(pageNum > 0 ? ((pageNum-1)*pageSize) : 0)
        .limit(pageSize)
        .toArray(function(err, items) {
            if(err || !items){
              /*this is called if any of the promises have failed */
              console.error(err);
              res.end();  /*?check*/
            }else{
              console.log(items);
              res.send(items);
            }
        });
    }
});

/*
 * Returns the size of the search results
 * 
 * Usage: 1. search?type=sample&fulltext=smk
 */
app.get('/searchSize', function(req, res) {

    var searchType = req.query.type;
  /*var pageNum = req.query.pageNum;*/
    var pageSize = parseInt(req.query.pageSize); /*limit() requires int*/

    if(searchType === 'sample'){

        var query = buildSampleQuery(req);

        db.samples.find(query)
        .count(function(err, count) {
            /* if you pass an integer, express framework will use it to set the
             * HTTP status code. To avoid this, we need to cast it to a string */
            if(err || !count){
                res.send("0");
            }else{
                console.log("searchSize: " + count);
                res.send(count.toString());
            }
        });
    }
});

/********************
 * SAMPLE operations
 ********************/

/* This will create or update the record depending on the existence of
 * the "_id" parameter in the body
 */
app.post('/sample', function(req, res) {

	/*the owner or admin... how to check if the cookie matches the name?
	 * let them change their own password when logged in : this is all*/
    if (!req.isAuthenticated()){
        res.send(401);
    };

    var body = req.body;

    /* MongoDB creates _id as an ObjectID, but doesn't retrieve _id as an ObjectID, so
     * we have to recreate it each time.
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
    
    if (!req.isAuthenticated()){
        res.send(401);
    };

    /* If successful returns the number of deleted records
     */
    var id = db.ObjectId(req.query.id);
    console.log("DELETE " + id);
    db.samples.remove({"_id": id}, function(err, numberRemoved){
        if (err || !numberRemoved){
            console.log("delete failed");
            res.send(err);
        } else {
            console.log("delete successful");
            res.send(numberRemoved);
        }
    });
});

/*********************
 * USER operations
 *********************/

/* Updates or inserts (upserts) a new user record in mongodb using mongojs.
 * Returns the record _id.
 * 
 * Usage: curl -H "Content-Type: application/json" 
 *             --cookie "connect.sid=s%3AIzaNbY6BuBKwcZxkdKI73Mo4.S6hhH7mzJPooqfXPI4TPIdKZws3Cxq3lDYmL%2FEtqgNw" 
 *             -d '{"username":"a_user@smk.dk", "password":"a_password"}' 
 *             http://localhost:3000/user
 *
 *             (To get the session cookie, first login)
 *             
 *             The first admin user needs creating in the database like this.....password is "admin"....change it!
 *             db.users.update({username: "cpo@smk.dk"},{ "_id" : ObjectId("53fae078e001c8c6af798ecd"), "username" : "cpo@smk.dk", "password" : "$2a$10$j4GD2P.isxPBgMCcEiFrPOBbRl4uTpeG.qQKe.trtnNj1M1yrF.te", "role" : "admin" }, {upsert:"true"})
 * */
app.post('/user', function(req, res){
	
    if (!req.isAuthenticated()){  /*session cookie must be present*/
        res.send(401); /*unauthorised*/
    };

    /* send user details in request body rather than as url parameters to avoid 
     * server logging and browser history caching */
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    
    /*missing name or password*/
    if(!username || !password){
        res.send(400); /*bad request*/
    } 
    
    /*only admin can edit others passwords*/
    if(req.user.username != username && req.user.role != "admin"){ 
        res.send(401); /*unauthorised*/
    };
    
    /*Only admin can alter role*/
    if(req.user.role != "admin"){ 
        role = "default";
    };
    
    /*setup mongo findAndModify options*/
    var options = {};
    options.query = {'username' : username};  /*query by username*/
    options.upsert = true;                    /*if query doesn't find a record then insert a new one */
    options.new = true;                       /*return the modified document (not the original)*/
    options.fields = {username: 1};           /*define fields for the returned document: just the id*/

    password = encrypt(password,  function(err, hash) {
    	
    	/*called when encrypt resolved*/	
        options.update = {$set: {"username": username, "password": hash, "role": role}};   /*data to write to the record*/

        if (err || !hash){
            console.log("user " + username + " not saved");
            throw err;
        } else {
        	db.users.findAndModify(options, function (err, record, lastErr) {
    	        if (err || !record){
    	            console.log("user " + username + " not saved");
    	            throw err;
    	        } else {
    	            console.log('user upsert successful, username: ' + record.username);
    	            res.send(record); /*or maybe just 200, or 201*/
    	        }
    	    });
        }
    });
});

/*
 * Sample options : DELETE will fail with 404 if the browser uses CORS and
 * sends an OPTIONS request which doesn't get answered
 */
app.options('/user', function(req, res){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    res.end();
});

/*
 * Delete a user profile
 * Usage: user?username=someuser@smk.dk
 */
app.delete('/user', function(req, res){
    
    if (!req.isAuthenticated() || req.user.role != "admin"){
        res.send(401);
    };

    /* If successful returns the number of deleted records
     */
    var username = req.query.username;
    console.log("DELETE " + username);

    db.users.remove({"username": username}, function(err, numberRemoved){
        if (err || !numberRemoved){
            console.log("delete failed");
            res.send(err);
        } else {
            console.log("delete successful");
            res.send(numberRemoved);
        }
    });
});

/*********************
 * ARTWORK operations
 *********************/

/* Updates or inserts (upserts) a new artwork record in mongodb using mongojs.
 * Returns the record _id.
 * */
app.post('/artwork', function(req, res){

    if (!req.isAuthenticated()){
        res.send(401);
    };

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
        var rg = new RegExp('^'+ invNum + '$', "i");
        var query = {"inventoryNum" :  { "$regex" : rg }};
        console.log("get artwork query : " + JSON.stringify(query));

        /* Regex will be inefficient, but we must have a case insensitive search for
         * inventory numbers as we don't want to duplicate records.
         * */
        db.artworks.find(query)
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

/********************
 * VOCAB operations
 ********************/

/* Updates or inserts (upserts) a new vocab in mongodb using mongojs.
 * 
 * Expected input:
 * {type : 'sampleType', item : {name: 'Material Sample', secondaryname: '', grp:'Physical samples'}}
 * 
 * Behaviour: "item" will be added to the "items" array of the same "sampleType":
 * {type : 'sampleType', items : [{name: 'Material Sample', secondaryname: '', grp:'Physical samples'},
 *                                {name: 'Paint Cross Section', secondaryname: '', grp:'Physical samples'} ]}
 *                                
 * Returns: the whole vocab list
 * */
app.post('/vocab', function(req, res){

    if (!req.isAuthenticated()){
        res.send(401);
    };

    var body = req.body;

    var query = {'type' : body.type, 'items.name' : body.item.name};
    db.vocabs.find(query).toArray(function(err, items) {
        /*if vocab doesn't exist*/
        if (err || !items || items.length == 0){
            /*create it*/
            /*inserts new entry if "sampletype" already exists*/
            /*db.vocabs.update({type:'colours'}, {$addToSet: {items: {name:'pulk', secondaryname:'', grp:'xxxx'}}})*/

            var query = {'type': body.type};
            var options = {};  //don't need this
            var b = {$addToSet: 
                        {items:{name : body.item.name,
                                secondaryname : body.item.secondaryname,
                                grp : body.item.grp
                               }
                        }
            };
            db.vocabs.update(query, b, options, function (err, created) {
                if (err || !created){
                    console.log(body.sampleType + " not created");
                    throw err;
                } else {
                    console.log('created successful ');
                    res.send(created);
                }
            });

        } else {
            /*overwrites an existing entry*/
            var query = {'type': body.type,'items.name': body.item.name};
            var options = {};  //don't need this
            var b = {$set: {"items.$.name": body.item.name, 
                            "items.$.secondaryname": body.item.secondaryname , 
                            "items.$.grp": body.item.grp 
                           }
            };
            db.vocabs.update(query, b, options, function (err, updated) {
                if (err || !updated){
                    console.log(body.sampleType + " not updated");
                    throw err;
                } else {
                    console.log('update successful ');
                    res.send(updated);
                }
            });
        }
    });
});

app.get('/vocab', function(req, res) {

    var type = req.query.type;
    var query = {};
    
    if (type != undefined){
        /*if a type is provided, just fetch that type, otherwise return all vocabs*/
        query = {"type" :  type}
    }
    console.log("get vocab query : " + JSON.stringify(query));

    db.vocabs.find(query)
    .toArray(function(err, items) {
        /*if error creating array, or if array is empty*/
        if (err || !items || !items.length){
            console.log("vocab " + type + " not found");
            res.send(404); /*"not found", will triggger .error() handler*/
        } else {
            res.send(items);
        }
    })
});

/********************
 * IMAGE operations
 ********************/
/*
 * The new body-parser module only handles urlencoded and json bodies. 
 * That means for multipart bodies (file uploads) you need an additional
 * module like busboy or formadible : this is the OLD version
 */
app.post('/image', function(req, res){

    if (!req.isAuthenticated()){
        res.send(401);
    };
    
    var readPath = req.files.file.path;
    var writePath = "/mnt/fotoarkiv/globus/catsdb/";
    var name = req.files.file.name;

    fs.readFile(readPath, function (err, data) {
        if(err) {
            console.log(err);
            res.send(500); /*"Internal server Error"*/
        }
        else {
            fs.writeFile(writePath + name, data, function(err) {
                if(err) {
                    console.log(err);
                    res.send(500); /*"Internal server Error"*/
                } else {
                    var url = "http://cspic.smk.dk/globus/catsdb/" + name;
                    console.log("The file was saved to " + url);
                    res.status(201).send(url); 
                }
            })
        }
    })
}); 

/********************
 * RECORD operations
 ********************/

//redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/***************
 * Start Server
 ***************/

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
