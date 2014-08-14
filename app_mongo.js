/**
 * Module dependencies
 */

var express = require('express'),
routes = require('./routes'),
api = require('./routes/api'),
http = require('http'),
path = require('path'),
db = require("./db_mongo");

var app = module.exports = express();

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
app.use(app.router);

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
//        var owner = req.query.owner;
        var partialterm = req.query.partialterm;
        
        if (partialterm){
            
            db.samples.find({
                "$text": {
                  "$search": partialterm
                }
//              }, {
//                document: 1,
//                created: 1,
//                _id: 1,
//                textScore: {
//                  $meta: "textScore"
//                }
//              }, {
//                sort: {
//                  textScore: {
//                    $meta: "textScore"
//                  }
//                }
                }).toArray(function(err, items) {
                    res.send(items);
//                res.setHeader("Access-Control-Allow-Origin", "*"); /*CORS*/
//                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8;'});
//                res.end(JSON.stringify(results));
              })
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
