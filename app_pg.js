/**
 * Module dependencies
 */

var express = require('express'),
routes = require('./routes'),
api = require('./routes/api'),
http = require('http'),
path = require('path'),
db = require("./db_pg");

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
 * Routes
 */

//serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

//JSON API
app.get('/api/name', api.name);

/*
 * This is used to test that node and postgres are both running and talking
 */
app.get('/time', function(req, res) {
    db.query('SELECT NOW() AS "theTime"', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        if(result.rows){
            console.log(result.rows[0].theTime);
            console.log(result.rows);
            res.send(result.rows);
        }
    });
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
        path: '/solr-example/preprod_all_dk/select?q=id_s%3A%22' + id +
              '%22&wt=json&indent=true',
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
 * Some basic searching using sql/json : consider using the proper text search
 * or solr instead
 * 
 * Usage: 1. search?type=sample&owner=smk
 *        2. search?type=sample&partialterm=smk (first level only - doesn't search child nodes)
 */
app.get('/search', function(req, res) {
    var searchType = req.query.type;
    if(searchType === 'sample'){
        var owner = req.query.owner;
        var partialterm = req.query.partialterm;
        if (owner){
            db.query("SELECT DISTINCT ON (samples.sample_id) samples.* FROM samples " + 
                     "WHERE sample_record->>'owner' = $1",
                     [owner], function(err, result) {
                if(err) {
                    return console.error('error running query', err);
                }
                if(result.rows){
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
        }
        else if (partialterm){
            console.log("partial term request on " + partialterm);
            var pt = '%' +  partialterm + '%';
            db.query("SELECT DISTINCT ON (samples.sample_id) samples.* FROM samples, " + 
                     "json_each_text(samples.sample_record) AS data WHERE value LIKE $1", 
                     [pt], function(err, result) {
                if(err) {
                    return console.error('error running query', err);
                }
                if(result.rows){
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
        }
    }
});

/**
 * SAMPLE operations
 */

app.post('/sample', function(req, res) {
    console.log("create sample request");
    var sample = req.body;
    db.query('INSERT INTO samples (sample_id, sample_record) VALUES (uuid_generate_v4(), $1)', 
             [JSON.stringify(sample)], function(err, result) {
        if(err) {
            return console.error('error creating sample', err);
        }
        if(result.rows){
            console.log(result);
            res.send(result);
        }
    });		
});

app.put('/sample', function(req, res) {
    var sampleId = req.query.id;
    var sample = req.body;
    console.log("update sample request (sample_id : " + sampleId + ")");
    if (sampleId){
        db.query('UPDATE samples SET sample_record = $2 WHERE sample_id = $1', 
                 [sampleId, JSON.stringify(sample)], function(err, result) {
            if(err) {
                return console.error('error updating sample', err);
            }
            if(result.rows){
                console.log(result);
                res.send(result);
            }
        });
    }
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
    var sampleId = req.query.id;
    console.log("delete sample request(ample_id : " + sampleId + ")");
    if (sampleId){
        db.query('DELETE FROM samples WHERE sample_id = $1', [sampleId], function(err, result){
            if(err) {
                return console.error('error deleting sample', err);
            }
            if(result.rows){
                console.log(result);
                res.send(result);
            }
        });
    }
});

/**
 * ARTWORK operations
 */

app.post('/artwork', function(req, res){
    console.log("create artwork request");
    var artwork = req.body;
    db.query('INSERT INTO artworks (artwork_id, artwork_record) VALUES (uuid_generate_v4(), $1)',
            [JSON.stringify(artwork)], function(err, result) {
        if(err) {
            return console.error('error creating artwork', err);
        }
        if(result.rows){
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/artwork', function(req, res) {
    var artwork = req.body;
    var artworkInventoryNum = req.query.id;
    console.log("retrieve artwork request (artwork.inventoryNum: " + artworkInventoryNum + ")");
    db.query("SELECT DISTINCT ON (artworks.artwork_id) artworks.* FROM artworks " + 
             "WHERE artwork_record->>'inventoryNum' = $1",
            [artworkInventoryNum], function(err, result) {	
        if(err) {
            return console.error('error retrieving artwork', err);
        }
        if(result.rows){
            console.log(result);
            res.send(result);
        }
    });
});

/**
 * RECORD operations
 */

//app.post('/sampleartwork', function(req, res) {
//console.log("create artwork request");
//var sampleartwork = req.body,
//sample = sampleartwork.sample,
//artwork = sampleartwork.artwork,
//artworkId = req.query.id;

//id = (id) ? id : 'uuid_generate_v4()';


//var query = 'BEGIN;' +
//'INSERT INTO artwork (artwork_id, artwork_record) VALUES ($2, $1)'


////Check for already existing object number
//db.query('INSERT INTO artwork (artwork_id, artwork_record) VALUES ($2, $1)',
//[JSON.stringify(artwork), id], function(err, result) {
//if(err) {
//return console.error('error creating artwork', err);
//}
//if(result.rows){
//console.log(result);
//res.send(result);
//}
//});
//});

//redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
