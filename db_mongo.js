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

/*Vocab defaults*/
var colours = { type : 'colours', items : [{name: 'black', secondaryname:'sort', grp:''},
                                           {name: 'blue', secondaryname:'blå', grp:''},
                                           {name: 'brown', secondaryname:'brun', grp:''},
                                           {name: 'green', secondaryname:'grøn', grp:''},
                                           {name: 'grey', secondaryname:'grå', grp:''},
                                           {name: 'orange', secondaryname:'orange', grp:''},
                                           {name: 'purple', secondaryname:'lilla', grp:''},
                                           {name: 'red', secondaryname:'rød', grp:''},
                                           {name: 'white', secondaryname:'hvid', grp:''},
                                           {name: 'yellow', secondaryname:'gul', grp:''}]};

db.vocabs.insert(colours, function(err, doc) {
    if (err || !doc){
        console.log("colours default vocabs not added :" + err);
    } else {
        console.log("colours default vocabs inserted successfully");
    }
});

//Public API
module.exports = db;