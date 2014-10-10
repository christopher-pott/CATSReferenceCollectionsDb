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
var colours = { type : 'colours', 
                items : [
                   {name: 'black', secondaryname:'sort', grp:''},
                   {name: 'blue', secondaryname:'blå', grp:''},
                   {name: 'brown', secondaryname:'brun', grp:''},
                   {name: 'green', secondaryname:'grøn', grp:''},
                   {name: 'grey', secondaryname:'grå', grp:''},
                   {name: 'orange', secondaryname:'orange', grp:''},
                   {name: 'purple', secondaryname:'lilla', grp:''},
                   {name: 'red', secondaryname:'rød', grp:''},
                   {name: 'white', secondaryname:'hvid', grp:''},
                   {name: 'yellow', secondaryname:'gul', grp:''}
                ]
              };

var pigments = { type : 'pigments',
                 items : [
                     {name: 'bone black', secondaryname:'bensort', grp:''},
                     {name: 'chalk', secondaryname:'kridt', grp:''},
                     {name: 'lamp black', secondaryname:'trækulsort', grp:''},
                     {name: 'lead white', secondaryname:'blyhvidt', grp:''},
                     {name: 'plaster', secondaryname:'gips', grp:''},
                     {name: 'red ocher', secondaryname:'rød okker', grp:'Earth colours'},
                     {name: 'yellow ocher', secondaryname:'gul okker', grp:'Earth colours'},
                     {name: 'titanium white', secondaryname:'titanhvidt', grp:''},
                     {name: 'vine black', secondaryname:'sodsort', grp:''},
                     {name: 'zinc white', secondaryname:'zinkhvidt', grp:''}
                 ]
               };

var binders = { type : 'binders',
                items : [
                    {name: 'casin', secondaryname: 'kasein', grp:''},
                    {name: 'emulsion', secondaryname: 'emulsion', grp:''},
                    {name: 'glue', secondaryname: 'lim', grp:'Glue'},
                    {name: 'animal glue', secondaryname: 'lim animalisk', grp:'Glue'},
                    {name: 'vegetable glue', secondaryname: 'lim vegetabilsk', grp:'Glue'},
                    {name: 'oil', secondaryname: 'olie', grp:'Oil'},
                    {name: 'linseed oil', secondaryname: 'linolie', grp:'Oil'},
                    {name: 'poppy oil', secondaryname: 'valmulie', grp:'Oil'},
                    {name: 'walnut oil', secondaryname: 'valnøddolie', grp:'Oil'},
                    {name: 'resin', secondaryname: 'harpiks', grp:''},
                    {name: 'synthetic', secondaryname: 'syntetisk', grp:''}
                 ]
              };

var dyes = { type : 'dyes',
             items : [
                 {name: 'asphalt', secondaryname:'asfalt', grp:''},
                 {name: 'indigo', secondaryname:'indigo', grp:''},
                 {name: 'unknown organic brown', secondaryname:'brun organisk - ubestemt', grp:'Organic brown'},
                 {name: 'brazilwood', secondaryname:'brasiltræ', grp:'Organic red'},
                 {name: 'cocheneal', secondaryname:'cochenille', grp:'Organic red'},
                 {name: 'krap', secondaryname:'krap', grp:'Organic red'},
                 {name: 'unknown organic red', secondaryname:'rød organisk - ubestemt', grp:'Organic red'},
                 {name: 'unknown organic yellow', secondaryname:'gul organisk - ubestemt', grp:'Organic yellow'}
             ]
           };

var materials = { type : 'materials',
        items : [
             {name: 'glass', secondaryname:'glas', grp:''},
             {name: 'bisque', secondaryname:'biskuit', grp:'Ceramical'},
             {name: 'chamotte', secondaryname:'chamotte', grp:'Ceramical'},
             {name: 'earthenware', secondaryname:'brændt ler', grp:'Ceramical'},
             {name: 'faience', secondaryname:'fajance', grp:'Ceramical'},
             {name: 'pipeclay', secondaryname:'pipeler', grp:'Ceramical'},
             {name: 'plastiline', secondaryname:'plastilin', grp:'Ceramical'},
             {name: 'porcelain', secondaryname:'porcelæn', grp:'Ceramical'},
             {name: 'raku', secondaryname:'raku', grp:'Ceramical'},
             {name: 'roche céramique', secondaryname:'roche céramique', grp:'Ceramical'},
             {name: 'stoneware', secondaryname:'stentøj', grp:'Ceramical'},
             {name: 'terra-cotta', secondaryname:'terrracotta', grp:'Ceramical'},
             {name: 'unfired clay', secondaryname:'ubrændt ler', grp:'Ceramical'},
             {name: 'canvas', secondaryname:'lærred', grp:''},
             {name: 'aluminum', secondaryname:'aluminium)', grp:'Metals'},
             {name: 'bronze', secondaryname:'bronze', grp:'Metals'},
             {name: 'copper', secondaryname:'kobber', grp:'Metals'},
             {name: 'gold', secondaryname:'guld', grp:'Metals'},
             {name: 'iron', secondaryname:'jern', grp:'Metals'},
             {name: 'lead', secondaryname:'bly', grp:'Metals'},
             {name: 'leaf gold', secondaryname:'bladguld', grp:'Metals'},
             {name: 'ore', secondaryname:'malm', grp:'Metals'},
             {name: 'pewter', secondaryname:'tin', grp:'Metals'},
             {name: 'silver', secondaryname:'sølv', grp:'Metals'},
             {name: 'tin', secondaryname:'blik', grp:'Metals'},
             {name: 'zinc', secondaryname:'zink', grp:'Metals'},
             {name: 'organic material', secondaryname:'organisk materiale', grp:''},
             {name: 'pigment scraping', secondaryname:'pigmentskrab', grp:''},
             {name: 'acrylate', secondaryname:'akryl', grp:'Synthetic'},
             {name: 'glass fibre', secondaryname:'glasfiber', grp:'Synthetic'},
             {name: 'plastic', secondaryname:'plast', grp:'Synthetic'},
             {name: 'polyester', secondaryname:'polyester', grp:'Synthetic'},
             {name: 'polyurethane foam', secondaryname:'polyurethanskum', grp:'Synthetic'},
             {name: 'polyvinyl chloride', secondaryname:'pvc', grp:'Synthetic'},
             {name: 'ash', secondaryname:'ask', grp:'Wood'},
             {name: 'beech', secondaryname:'bøgetræ', grp:'Wood'},
             {name: 'birch', secondaryname:'birketræ', grp:'Wood'},
             {name: 'boxwood', secondaryname:'buksbom', grp:'Wood'},
             {name: 'Brazilian rosewood', secondaryname:'palisander', grp:'Wood'},
             {name: 'ebony', secondaryname:'ibenholt', grp:'Wood'},
             {name: 'elm', secondaryname:'elmetræ', grp:'Wood'},
             {name: 'lime', secondaryname:'lindetræ', grp:'Wood'},
             {name: 'mable', secondaryname:'ahorn', grp:'Wood'},
             {name: 'mahogany', secondaryname:'mahogni', grp:'Wood'},
             {name: 'nut', secondaryname:'nøddetræ', grp:'Wood'},
             {name: 'oak', secondaryname:'egetræ', grp:'Wood'},
             {name: 'pine', secondaryname:'fyr/pinjetræ', grp:'Wood'},
             {name: 'poplar', secondaryname:'poppeltræ', grp:'Wood'},
             {name: 'sandalwood', secondaryname:'sandeltræ', grp:'Wood'},
             {name: 'teak', secondaryname:'teaktræ', grp:'Wood'},
             {name: 'walnut', secondaryname:'valnøddetræ', grp:'Wood'},
             {name: 'willow', secondaryname:'piletræ', grp:'Wood'}
           ]
        };

db.vocabs.insert(colours, function(err, doc) {
    if (err || !doc){
        console.log("colours default vocabs not added :" + err);
    } else {
        console.log("colours default vocabs inserted successfully");
    }
});

db.vocabs.insert(pigments, function(err, doc) {
    if (err || !doc){
        console.log("pigments default vocabs not added :" + err);
    } else {
        console.log("pigments default vocabs inserted successfully");
    }
});

db.vocabs.insert(binders, function(err, doc) {
    if (err || !doc){
        console.log("binders default vocabs not added :" + err);
    } else {
        console.log("binders default vocabs inserted successfully");
    }
});

db.vocabs.insert(dyes, function(err, doc) {
    if (err || !doc){
        console.log("dyes default vocabs not added :" + err);
    } else {
        console.log("dyes default vocabs inserted successfully");
    }
});

db.vocabs.insert(materials, function(err, doc) {
    if (err || !doc){
        console.log("materials default vocabs not added :" + err);
    } else {
        console.log("materials default vocabs inserted successfully");
    }
});

//Public API
module.exports = db;