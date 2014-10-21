/**
 * Mongo database for caching corpus responses
 */

var databaseUrl = "cats";
var collections = ["samples", "artworks", "users", "vocabs"];
var db = require("./node_modules/mongojs").connect(databaseUrl, collections);

/* Create a text index on all samples to enable
 * mongos full text search capability
 */
db.samples.ensureIndex(
        { "$**": "text" },
        { name: "TextIndex" }
);

/* Add a unique constraint to the vocabs "type" field, so we will only insert the
 * vocabulary default lists (at node startup) if they don't already exist
 */
db.vocabs.ensureIndex(
        { "type": 1 },
        { unique: true }
);

/* Copy over the default vocabs to catsdb upon startup (if they are not present)
 */
var v = require('./vocabs');
var defaults = v.defaultVocabs();

for (var i=0; i < defaults.length; i++){
    db.vocabs.insert(defaults[i], function(err, doc) {
        if (err || !doc){
            /*if the error is 'duplicate' - it just means the vocab is already initialised*/
            if(err && err.code == 11000) {/*mongo duplicate key error*/
                console.log("Vocab already exists (ignore error below)");
            }
            console.log("Default vocab not added : " + err);
        } else {
            console.log(doc.type + " default vocabs inserted successfully");
        }
    });
}

//Public API
module.exports = db;