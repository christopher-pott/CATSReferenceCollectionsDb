/*Vocab defaults
 * 
 * These are just the initial defaults when the app is started for the first time.
 * To add or edit vocabularies, use the "vocab" service provided by app_mongo.js
 * 
 * (This would be more pleasing as a 'proper' json file, but would require 
 *  reformatting and parsing)
 * 
 * */

module.exports = {

    defaultVocabs: function () {
        return     [ { type : 'colours',
                      permisssions : 'default',
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
                    },
                    { type : 'pigments',
                      permisssions : 'default',
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
                    },
                    { type : 'binders',
                      permisssions : 'default',
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
                    },
                    { type : 'dyes',
                      permisssions : 'default',
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
                    },
                    { type : 'materials',
                      permisssions : 'default',
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
                    },
                    { type : 'layerTypes',
                      permisssions : 'admin',
                      items : [
                          {name: 'Ground', secondaryname:'', grp:''},
                          {name: 'Imprimatura', secondaryname:'', grp:''},
                          {name: 'Paint', secondaryname:'', grp:''},
                          {name: 'Varnish', secondaryname:'', grp:''}
                      ]
                    },
                    { type : 'analysisTypes',
                      permisssions : 'admin',
                      items : [
                          {name: 'Automated thread count'},
                          {name: 'C14'},
                          {name: 'Dendrochronology'},
                          {name: 'FTIR'},
                          {name: 'GC-MS'},
                          {name: 'HPLC'},
                          {name: 'IRR'},
                          {name: 'Microscopy'},
                          {name: 'Other'},
                          {name: 'Photographic'},
                          {name: 'Polar. Micro.'},
                          {name: 'Raman'},
                          {name: 'SEM/EDX'},
                          {name: 'Visual'},
                          {name: 'Weave mapping'},
                          {name: 'Wood identification'},
                          {name: 'X-radiography'},
                          {name: 'XRF'}
                      ]
                    },
                    { type : 'fibreTypes',
                      permisssions : 'admin',
                      items : [
                          {name: 'blend'},
                          {name: 'cellulose (wooden)'},
                          {name: 'cotton'},
                          {name: 'hemp'},
                          {name: 'linen'},
                          {name: 'other'},
                          {name: 'synthetic'}
                      ]
                    },
                    { type : 'fibreGlueTypes',
                      permisssions : 'admin',
                      items : [
                          {name: 'animal'},
                          {name: 'synthetic'},
                          {name: 'vegetable'}
                      ]
                    },
                    { type : 'sampleOwners',
                      permisssions : 'admin',
                      items : [   
                         {name: 'National Museum of Denmark'},
                         {name: 'School of Conservation'},
                         {name: 'Statens Museum for Kunst (SMK)'}
                      ]
                    },
                    { type : 'sampleTypes',
                      permisssions : 'admin',
                      items : [
                         {id: 'fibre', name: 'Fibre(paper)', grp:'Physical samples'},
                         {id: 'material', name: 'Material Sample', grp:'Physical samples'},
                         {id: 'paint', name: 'Paint Cross Section', grp:'Physical samples'},
                         {id: 'pigment', name: 'Pigment', grp:'Physical samples'},
                         {id: 'stretcher', name: 'Stretcher/Strainer', grp:'Physical samples'},
                         {id: 'noninvasive', name: 'Non-invasive analysis (no sample)', grp:'Non invasive methods'}
                      ]
                    },
                    { type : 'mediaTypes',
                      permisssions : 'admin',
                      items : [  
                         {name: 'black-and-white negative film', grp:''},
                         {name: 'dias', grp:''},
                         {name: 'analogue IR film', grp:'IR'},
                         {name: 'Digital Artist', grp:'IR'},
                         {name: 'Digital Osiris', grp:'IR'},
                         {name: 'IR vidicon ', grp:'IR'}
                      ]
                    },
                    { type : 'mediaFilms',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'Dowie'},
                         {name: 'EPD120'},
                         {name: 'FP4'},
                         {name: 'FP special'},
                         {name: 'HP3'},
                         {name: 'IR-HS'},
                         {name: 'Kodak IR-ER'},
                         {name: 'Kodak IR.HS4143'}
                      ]
                    },
                    { type : 'mediaFormats',
                      permisssions : 'admin',
                      items : [ 
                         {name: '4 x 4'},
                         {name: '4 x 5'},
                         {name: '6 x 6'},
                         {name: '24 x 36'}
                      ]
                    },
                    { type : 'mediaFilters',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'Kodak Wratten 2B'},
                         {name: 'Kodak Wratten 2E'},
                         {name: 'Kodak Wratten 87'},
                         {name: 'Kodak Wratten 87C'},
                         {name: 'Kodak Wratten 88A'},
                         {name: 'polarization filter'},
                         {name: 'Schott UG-12'}
                      ]
                    },
                    { type : 'mediaLightings',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'natural'},
                         {name: 'regular'},
                         {name: 'side light'},
                         {name: 'sodium light'},
                         {name: 'symmetrical light'},
                         {name: 'tangential light'},
                         {name: 'UV flourescence'},
                         {name: 'UV reflected'}
                      ]
                    },
                    { type : 'mediaScopes',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'back'},
                         {name: 'detail'},
                         {name: 'front'},
                         {name: 'total'}
                      ]
                    },
                    { type : 'xrayTypes',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'analogue'},
                         {name: 'digital'},
                         {name: 'scan'}
                      ]
                    },
                    { type : 'xrayFilmTypes',
                      permisssions : 'admin',
                      items : [ 
                         {name: '30 x 40 cm'},
                         {name: 'Repro film'}
                      ]
                    },
                    { type : 'xrayFilters',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'aluminium'},
                         {name: 'iron'},
                         {name: 'copper'}
                      ]
                    },
                    { type : 'stretcherConditions',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'complete', secondaryname: 'komplet'},
                         {name: 'fragment', secondaryname: 'fragment'}
                      ]
                    },
                    { type : 'stretcherTypes',
                      permisssions : 'admin',
                      items : [
                         {name: 'strainer', secondaryname: 'spændramme'},
                         {name: 'stretcher', secondaryname: 'kileramme'},
                         {name: 'with horizontal cross bar', secondaryname: 'med tværsprosse'},
                         {name: 'with intersecting cross bars', secondaryname: 'med kryds'},
                         {name: 'with double intersecting cross bars', secondaryname: 'med dobbelt kryds'}
                      ]
                    },
                    { type : 'stretcherJointTechniques',
                      permisssions : 'admin',
                      items : [
                         {name: 'bridle joint', secondaryname: 'slids'},
                         {name: 'mitered bridle joint', secondaryname: 'slids med gering'},
                         {name: 'lap joint', secondaryname: 'bladsamling'},
                         {name: 'pinned', secondaryname: 'med dyveler'},
                         {name: 'with reinforcement', secondaryname: 'med forstærkningsplade'},
                         {name: 'other', secondaryname: 'anden'}
                      ]
                    },
                    { type : 'stretcherMaterialTypes',
                      permisssions : 'admin',
                      items : [
                         {name: 'hardwood', secondaryname: 'løvtræ'},
                         {name: 'softwood ', secondaryname: 'nåletræ'}
                      ]
                    },
                    { type : 'pigmentForms',
                      permisssions : 'admin',
                      items : [ 
                         {name: 'chunk', secondaryname: 'stykke'},
                         {name: 'crystal', secondaryname: 'krystal'},
                         {name: 'flakes', secondaryname: 'flager'},
                         {name: 'powder', secondaryname: 'pulver'},
                         {name: 'stone', secondaryname: 'sten'},
                         {name: 'bound to textile', secondaryname: 'tekstil'}
                      ]
                    },
                    { type : 'pigmentContainers',
                      permisssions : 'admin',
                      items : [
                         {name: 'glass container', secondaryname: 'glasbeholder'},
                         {name: 'microscope slide', secondaryname: 'objektglas'},
                         {name: 'original container', secondaryname: 'originalemballage'},
                         {name: 'paper', secondaryname: 'papir'},
                         {name: 'plastic container', secondaryname: 'plastikbeholder'}
                      ]
                    }
                ];
    }
}