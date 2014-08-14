/**
 * Mongo database for caching corpus responses
 */

var databaseUrl = "cats";
var collections = ["samples", "artworks"];
var db = require("./node_modules/mongojs").connect(databaseUrl, collections);

//Create text index on all fields in sample collection
db.samples.ensureIndex(
        { "$**": "text" },
        { name: "TextIndex" }
      );

//Public API
module.exports = db;