/**
 * Postgres database 
 */

var pg = require('pg'); 
var conString = "postgres://test:test@localhost/cats";
var db = new pg.Client(conString);
db.connect();

//Public API
module.exports = db;