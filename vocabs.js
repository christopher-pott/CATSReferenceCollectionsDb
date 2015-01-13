/*Vocab defaults
 * 
 * These are just the initial defaults when the app is started for the first time.
 * To add or edit vocabularies, use the 'vocab' service provided by app_mongo.js
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
                          {grp:'', name:'accroides', secondaryname:'acaroid'},
                          {grp:'', name:'aerinite', secondaryname:''},
                          {grp:'', name:'alkanet', secondaryname:'Alkanna tinctoria, dyers bugloss, alkanet root '},
                          {grp:'', name:'aloe', secondaryname:'aloe '},
                          {grp:'', name:'alumina trihydrate', secondaryname:''},
                          {grp:'', name:'aluminum oxide', secondaryname:''},
                          {grp:'', name:'amber', secondaryname:'rav'},
                          {grp:'', name:'aniline blue', secondaryname:'anlilinblå'},
                          {grp:'', name:'aniline red', secondaryname:'anilinrød'},
                          {grp:'', name:'aniline yellow', secondaryname:'anilingul'},
                          {grp:'', name:'annatto', secondaryname:'anotta, anatto'},
                          {grp:'', name:'antimony trisulfide', secondaryname:'antimontrisulfid, guldsvovl'},
                          {grp:'', name:'antimony white', secondaryname:'antimonhvid'},
                          {grp:'', name:'asphalt graphite', secondaryname:'asfalt grafit'},
                          {grp:'', name:'asphalt', secondaryname:'asfalt '},
                          {grp:'', name:'azure blue', secondaryname:'azurblå'},
                          {grp:'', name:'azurite', secondaryname:'azurit, bjergblå'},
                          {grp:'', name:'barberry', secondaryname:'berberris'},
                          {grp:'', name:'barite', secondaryname:'baryte, tungspat'},
                          {grp:'', name:'barium white', secondaryname:''},
                          {grp:'', name:'barium yellow', secondaryname:'bariumgul'},
                          {grp:'', name:'basic copper acetate', secondaryname:''},
                          {grp:'', name:'basic lead sulfate', secondaryname:''},
                          {grp:'', name:'Berlin red', secondaryname:'berlinerrød'},
                          {grp:'', name:'black bole', secondaryname:'bolus sort'},
                          {grp:'', name:'blanc fixe', secondaryname:''},
                          {grp:'', name:'blue lake', secondaryname:'blå lak, laque bleue'},
                          {grp:'', name:'blue verditer', secondaryname:'bremerblå'},
                          {grp:'', name:'bole', secondaryname:'bolus'},
                          {grp:'', name:'bone black', secondaryname:'bensort'},
                          {grp:'', name:'brazilwood', secondaryname:'brazil-træ'},
                          {grp:'', name:'brilliant green', secondaryname:'brilliant grøn'},
                          {grp:'', name:'brilliant yellow', secondaryname:'brilliant gul'},
                          {grp:'', name:'buckthorn bark', secondaryname:'havtornebark, faulbaumrinde'},
                          {grp:'', name:'buckthorn', secondaryname:'vrietorn, havtorn'},
                          {grp:'', name:'burnt green earth', secondaryname:'burnt terre verte, brændt grønjord, verona brun'},
                          {grp:'', name:'burnt ocher', secondaryname:'brændt okker'},
                          {grp:'', name:'burnt sienna', secondaryname:'brændt siena'},
                          {grp:'', name:'burnt umber', secondaryname:'iron oxide brown, jernoxidbrun, brændt umbra'},
                          {grp:'', name:'cadmium brown', secondaryname:'cadmium oxide, kadmiumbrun '},
                          {grp:'', name:'cadmium orange', secondaryname:''},
                          {grp:'', name:'cadmium red', secondaryname:'kadmiumrød'},
                          {grp:'', name:'cadmium yellow', secondaryname:'kadmiumgul'},
                          {grp:'', name:'cadmium', secondaryname:'kadmium'},
                          {grp:'', name:'cadmiumorange', secondaryname:'kadmiumorange'},
                          {grp:'', name:'cadmopur yellow', secondaryname:'kadmopurgul'},
                          {grp:'', name:'calcium chromate', secondaryname:''},
                          {grp:'', name:'calcium sulfate', secondaryname:'kalciumsulfat'},
                          {grp:'', name:'California yellow', secondaryname:'californiagul'},
                          {grp:'', name:'carbon black', secondaryname:'soot black, sodsort, vine black, druesort, frankfurtersort'},
                          {grp:'', name:'carmine lake', secondaryname:'karmin'},
                          {grp:'', name:'cement black', secondaryname:'cementsort'},
                          {grp:'', name:'cement red', secondaryname:'cementrød'},
                          {grp:'', name:'Ceres red', secondaryname:'ceresrød'},
                          {grp:'', name:'cerulean blue', secondaryname:'ceruleanblå'},
                          {grp:'', name:'chalk', secondaryname:'kridt'},
                          {grp:'', name:'cherry gum', secondaryname:'kirsebærgummi'},
                          {grp:'', name:'Chinese white', secondaryname:'kinesisk hvid'},
                          {grp:'', name:'chinolin', secondaryname:''},
                          {grp:'', name:'chrome green', secondaryname:'green vermilion, cinnobergrøn, chromgrøn, kromgrøn'},
                          {grp:'', name:'chrome orange', secondaryname:'chromorange'},
                          {grp:'', name:'chrome oxide', secondaryname:'chromoxid, kromilte'},
                          {grp:'', name:'chrome red', secondaryname:'chromrød'},
                          {grp:'', name:'chrome yellow', secondaryname:'chromgul'},
                          {grp:'', name:'chromium oxide blue', secondaryname:'chromoxydblå'},
                          {grp:'', name:'chromium oxide green', secondaryname:'chromoxidgrøn, ultramarine green, ultramaringrøn, bronzegrøn'},
                          {grp:'', name:'chromium oxide hydrate', secondaryname:'chromoxidhydrat, viridium'},
                          {grp:'', name:'chrysocolla', secondaryname:'cedar green, copper silicate'},
                          {grp:'', name:'cobalt blue', secondaryname:'koboltblå'},
                          {grp:'', name:'cobalt green', secondaryname:'koboltgrøn, zinc green, zinkgrøn'},
                          {grp:'', name:'cobalt violet', secondaryname:'koboltviolet'},
                          {grp:'', name:'cobalt yellow', secondaryname:'koboltgul'},
                          {grp:'', name:'cochineal', secondaryname:'cochenille, Florentine lake, florentinerlak'},
                          {grp:'', name:'copper acetate', secondaryname:'kobberacetat'},
                          {grp:'', name:'copper hydroxide phosphate', secondaryname:'kobberhydroxidfosfat'},
                          {grp:'', name:'copper resinate', secondaryname:''},
                          {grp:'', name:'copper sulfate', secondaryname:'kobbersulfat'},
                          {grp:'', name:'curcuma', secondaryname:''},
                          {grp:'', name:'dammar', secondaryname:'damar, dammerharpiks'},
                          {grp:'', name:'dolomite', secondaryname:'dolomit, calcium magnesium carbonate'},
                          {grp:'', name:'Dragons blood', secondaryname:'drageblod'},
                          {grp:'', name:'dyers broom', secondaryname:'genista tinctoria'},
                          {grp:'', name:'earth brown', secondaryname:'jordbrun'},
                          {grp:'', name:'earth colour', secondaryname:'jordfarve'},
                          {grp:'', name:'Egyptian blue', secondaryname:'ægyptisk blå'},
                          {grp:'', name:'emerald green', secondaryname:'smaragdgrøn'},
                          {grp:'', name:'Empire red', secondaryname:'kejserrød'},
                          {grp:'', name:'Ferric hydroxide', secondaryname:'iron oxide yellow, jernoxidgul, ferrihydroxid, rust'},
                          {grp:'', name:'flame black', secondaryname:'flammesort'},
                          {grp:'', name:'Florentine brown', secondaryname:'florentinerbrun'},
                          {grp:'', name:'glaze yellow', secondaryname:'lasurgul'},
                          {grp:'', name:'gold bronze', secondaryname:'guldbronze'},
                          {grp:'', name:'graphite', secondaryname:'grønjord '},
                          {grp:'', name:'gravel', secondaryname:'sand, grus'},
                          {grp:'', name:'green earth', secondaryname:''},
                          {grp:'', name:'green earth', secondaryname:'grønjord'},
                          {grp:'', name:'green verditer', secondaryname:'bremergrøn'},
                          {grp:'', name:'Hansa orange', secondaryname:'hansaorange'},
                          {grp:'', name:'Hansa yellow', secondaryname:''},
                          {grp:'', name:'Heliogen blue', secondaryname:'heliogenblå'},
                          {grp:'', name:'hematite', secondaryname:'hæmatit, blodsten'},
                          {grp:'', name:'henna', secondaryname:''},
                          {grp:'', name:'horsetail', secondaryname:'skavgræs, schactelhalm'},
                          {grp:'', name:'Indian gum resin', secondaryname:'indisk gummiharpiks'},
                          {grp:'', name:'Indian red', secondaryname:'indisk rød'},
                          {grp:'', name:'Indian yellow', secondaryname:'indisk gul'},
                          {grp:'', name:'indigo', secondaryname:'indigo'},
                          {grp:'', name:'iron black', secondaryname:'jernsort'},
                          {grp:'', name:'iron laquer', secondaryname:'jernlak'},
                          {grp:'', name:'iron oxide black', secondaryname:'jernoxidsort'},
                          {grp:'', name:'iron oxide brown', secondaryname:''},
                          {grp:'', name:'iron oxide ocher', secondaryname:''},
                          {grp:'', name:'iron oxide orange', secondaryname:'jernoxidorange'},
                          {grp:'', name:'iron oxide red', secondaryname:'jernoxidrød, light red, English red'},
                          {grp:'', name:'iron oxide', secondaryname:''},
                          {grp:'', name:'ivory black', secondaryname:''},
                          {grp:'', name:'kaolin', secondaryname:'kaolin'},
                          {grp:'', name:'kermes', secondaryname:'kermes'},
                          {grp:'', name:'lacker yellow', secondaryname:'lakgul'},
                          {grp:'', name:'lamp black', secondaryname:'lampesort'},
                          {grp:'', name:'lapis lazuli', secondaryname:'lapis lazuli'},
                          {grp:'', name:'laterite', secondaryname:'laterit'},
                          {grp:'', name:'lead acetate', secondaryname:'blyacetat, lead sugar, blysukker'},
                          {grp:'', name:'lead grey', secondaryname:'blygrå'},
                          {grp:'', name:'lead oxide', secondaryname:'blyoxid'},
                          {grp:'', name:'lead white', secondaryname:'blyhvidt, blyhvid, kremserhvidt'},
                          {grp:'', name:'lead-tin yellow', secondaryname:'blytingul'},
                          {grp:'', name:'lemon yellow', secondaryname:'ultramarine yellow, ultramaringul'},
                          {grp:'', name:'lime blue', secondaryname:'kalkblå'},
                          {grp:'', name:'lime rock(s)', secondaryname:'kalksten'},
                          {grp:'', name:'limonite', secondaryname:'limonit'},
                          {grp:'', name:'lithopone', secondaryname:'lithopone'},
                          {grp:'', name:'litmus', secondaryname:'lakmus'},
                          {grp:'', name:'logwood', secondaryname:'blåtræ'},
                          {grp:'', name:'lokao', secondaryname:'Chinese green, Kinesisk oliegrøn'},
                          {grp:'', name:'madder', secondaryname:'alizarin, kraplak'},
                          {grp:'', name:'malachite green', secondaryname:'malakitgrøn, Victoria green, viktoriagrøn'},
                          {grp:'', name:'malachite', secondaryname:'malakit'},
                          {grp:'', name:'Malaga red', secondaryname:'malagarød'},
                          {grp:'', name:'Manganese black', secondaryname:'mangansort'},
                          {grp:'', name:'Manganese blue', secondaryname:'manganblå'},
                          {grp:'', name:'Manganese brown', secondaryname:'manganbrun, manganbraun'},
                          {grp:'', name:'Manganese violet', secondaryname:''},
                          {grp:'', name:'maroon', secondaryname:'maron, chestnut'},
                          {grp:'', name:'Mars red', secondaryname:'marsrød'},
                          {grp:'', name:'Mars violet', secondaryname:'marsviolet'},
                          {grp:'', name:'Mars yellow', secondaryname:'marsgul'},
                          {grp:'', name:'massicot', secondaryname:'lead monoxide'},
                          {grp:'', name:'Milori blue', secondaryname:'miloriblå'},
                          {grp:'', name:'minium', secondaryname:''},
                          {grp:'', name:'minium', secondaryname:'mønje'},
                          {grp:'', name:'molybdemon blue', secondaryname:'molybdenblå'},
                          {grp:'', name:'Monastral blue', secondaryname:'monastralblå'},
                          {grp:'', name:'Monastral green', secondaryname:'monastralgrøn'},
                          {grp:'', name:'mummy', secondaryname:'mumiin'},
                          {grp:'', name:'myrrh', secondaryname:'myrrha'},
                          {grp:'', name:'Naples yellow', secondaryname:'neapelgul'},
                          {grp:'', name:'ocher', secondaryname:'okker'},
                          {grp:'', name:'organic green', secondaryname:'organisk grøn'},
                          {grp:'', name:'organic violet', secondaryname:'organisk violet'},
                          {grp:'', name:'organic yellow', secondaryname:'organisk gul'},
                          {grp:'', name:'orpiment', secondaryname:'auripigment'},
                          {grp:'', name:'oxide brown', secondaryname:'oxidbrun'},
                          {grp:'', name:'oxide red', secondaryname:'oxidrød'},
                          {grp:'', name:'oxide yellow', secondaryname:'oxidgul'},
                          {grp:'', name:'pearl red', secondaryname:'perlerød'},
                          {grp:'', name:'permanent green', secondaryname:'permanentgrøn'},
                          {grp:'', name:'permanent red', secondaryname:'permanentrød'},
                          {grp:'', name:'permanent yellow', secondaryname:'permanentgul'},
                          {grp:'', name:'plaster', secondaryname:'gips, gypsum'},
                          {grp:'', name:'Pompeian blue', secondaryname:'pompeijansk blå'},
                          {grp:'', name:'Pompeian red', secondaryname:'pompeijanskrød'},
                          {grp:'', name:'Pompeian yellow', secondaryname:'pompeijanskgul'},
                          {grp:'', name:'pozzuoli red', secondaryname:'pozzuolijord, terra di pozzuoli'},
                          {grp:'', name:'Prussian blue', secondaryname:'berlinerblå, Paris blue, pariserblå'},
                          {grp:'', name:'pumice', secondaryname:'pimpsten'},
                          {grp:'', name:'pyrite', secondaryname:''},
                          {grp:'', name:'quartz', secondaryname:'kvarts'},
                          {grp:'', name:'quercitron', secondaryname:''},
                          {grp:'', name:'raw sienna', secondaryname:'rå siena'},
                          {grp:'', name:'realgar', secondaryname:'realgar'},
                          {grp:'', name:'red bole', secondaryname:'bolus rød'},
                          {grp:'', name:'red lead', secondaryname:'jernmønje'},
                          {grp:'', name:'red ocher', secondaryname:'dodenkop, caput mortuum'},
                          {grp:'', name:'saffron red', secondaryname:'safranrød'},
                          {grp:'', name:'saffron', secondaryname:'safran'},
                          {grp:'', name:'sandalwood dye', secondaryname:'sandeltræ'},
                          {grp:'', name:'sandarac', secondaryname:'sandarak'},
                          {grp:'', name:'sap green lake', secondaryname:'grøn lak'},
                          {grp:'', name:'Schweinfürther green', secondaryname:'Schweinfürthergrøn'},
                          {grp:'', name:'selenium', secondaryname:''},
                          {grp:'', name:'sepia', secondaryname:''},
                          {grp:'', name:'shellac', secondaryname:'shellak, schellack'},
                          {grp:'', name:'shells', secondaryname:'sneglehuse, skaller'},
                          {grp:'', name:'sienna', secondaryname:'siena'},
                          {grp:'', name:'signal red', secondaryname:'signalrød'},
                          {grp:'', name:'slate flour', secondaryname:'skifermel'},
                          {grp:'', name:'smalt', secondaryname:'smalte'},
                          {grp:'', name:'Spanish red', secondaryname:'spanskrød'},
                          {grp:'', name:'stannic oxide', secondaryname:'tin oxide, tinoxid'},
                          {grp:'', name:'strontium white', secondaryname:'strontiumhvid'},
                          {grp:'', name:'strontium yellow', secondaryname:'strontiangul'},
                          {grp:'', name:'Sudan black', secondaryname:'Sudantiefschwartz'},
                          {grp:'', name:'Sudan red', secondaryname:'sudanrød'},
                          {grp:'', name:'synthetic verdigris', secondaryname:'syntetisk ir'},
                          {grp:'', name:'talc', secondaryname:'talcum, talkum'},
                          {grp:'', name:'thioindigo violet', secondaryname:''},
                          {grp:'', name:'titanium white', secondaryname:'titanhvid '},
                          {grp:'', name:'tripoli', secondaryname:'trippelse'},
                          {grp:'', name:'tungsten white', secondaryname:'wolfram white, wolframhvid'},
                          {grp:'', name:'turmeric', secondaryname:'gurkemeje'},
                          {grp:'', name:'turquoise', secondaryname:'turkis'},
                          {grp:'', name:'ultramarine blue', secondaryname:'ultramarinblå'},
                          {grp:'', name:'ultramarine red', secondaryname:'ultramarinrød'},
                          {grp:'', name:'ultramarine violet', secondaryname:'ultramarinviolet'},
                          {grp:'', name:'ultramarine', secondaryname:'ultramarin'},
                          {grp:'', name:'umber', secondaryname:'umbra'},
                          {grp:'', name:'Vandyke brown', secondaryname:'Cassel earth, kasselerbrun, Cologne earth, kølnerbrunt'},
                          {grp:'', name:'Venetian red', secondaryname:'venetiansk rød'},
                          {grp:'', name:'verdigris', secondaryname:'spansk grøn'},
                          {grp:'', name:'vermilion', secondaryname:'cinnober'},
                          {grp:'', name:'wagon green', secondaryname:'vogngrøn'},
                          {grp:'', name:'walnut', secondaryname:'valnød'},
                          {grp:'', name:'weld dye', secondaryname:'reseda luteola'},
                          {grp:'', name:'yellow bole', secondaryname:'bolus gul'},
                          {grp:'', name:'yellow from palermo', secondaryname:'gul fra palermo'},
                          {grp:'', name:'yellow lake', secondaryname:'gul lak'},
                          {grp:'', name:'yellow', secondaryname:'gul'},
                          {grp:'', name:'zinc chromate', secondaryname:'zinkchromat, zinc yellow, zinkgul'},
                          {grp:'', name:'zinc sulfide', secondaryname:''},
                          {grp:'', name:'zinc white', secondaryname:'zinkhvid'},
                          {grp:'', name:'zirconium', secondaryname:'zirkoniumhvid'}
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
                         {grp:'', name:'bound to textile', secondaryname:'tekstil'},
                         {grp:'', name:'chip(s)', secondaryname:'flager'},
                         {grp:'', name:'chunk(s)', secondaryname:'stykke'},
                         {grp:'', name:'crystal(s)', secondaryname:'krystal'},
                         {grp:'', name:'flake(s)', secondaryname:''},
                         {grp:'', name:'olie', secondaryname:''},
                         {grp:'', name:'particles', secondaryname:''},
                         {grp:'', name:'powder', secondaryname:'pulver'},
                         {grp:'', name:'rock(s)', secondaryname:'sten'},
                         {grp:'', name:'shells', secondaryname:''},
                         {grp:'', name:'sticks', secondaryname:''},
                         {grp:'', name:'stone', secondaryname:''},
                         {grp:'', name:'string(s)', secondaryname:''},
                         {grp:'', name:'væske', secondaryname:''},
                         {grp:'', name:'wax', secondaryname:''}
                      ]
                    },
                    { type : 'pigmentContainers',
                      permisssions : 'admin',
                      items : [
                         {grp:'',name:'glass container', secondaryname:''},
                         {grp:'',name:'glass box', secondaryname:''},
                         {grp:'',name:'glass container in glass container', secondaryname:''},
                         {grp:'',name:'glass container in plastic container', secondaryname:''},
                         {grp:'',name:'glass container, in glass container', secondaryname:''},
                         {grp:'',name:'glass jar', secondaryname:'glasbeholder'},
                         {grp:'',name:'original container', secondaryname:'originalemballage'},
                         {grp:'',name:'plastic bag in glass container', secondaryname:''},
                         {grp:'',name:'plastic box', secondaryname:''},
                         {grp:'',name:'plastic container in glass container', secondaryname:''},
                         {grp:'',name:'plastic container', secondaryname:'plastikbeholder'},
                         {grp:'',name:'plastic square open box', secondaryname:''},
                         {grp:'',name:'small bottle', secondaryname:'lille flaske'},
                         {grp:'',name:'small glass container', secondaryname:''},
                         {grp:'',name:'small plastic container', secondaryname:''},
                         {grp:'',name:'tall glass container', secondaryname:''}
                      ]
                    }
                ];
    }
}