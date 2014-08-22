'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ui.bootstrap']).
controller('AppCtrl', function ($scope, $http, state, $location, $modal, catsAPIservice) {
    
    catsAPIservice.loggedin().success(function (response) {
        state.loggedin = !!response;
        $scope.loggedin = state.loggedin;
    }).error(function (err) {
        state.loggedin = false;
    });

    
    /* Search button click directs over to the search controller
       and saves the search term to the state where it can be
       retrieved by the search controller when triggered by this
       change on the searchRequested flag */
    $scope.searchClicked = function(searchTerm) {
        $location.path('/search');
        state.searchTerm = searchTerm;
        state.searchRequested = true;
    };

    /* Opens the user login modal window*/
    $scope.loginUser = function () {
        var loginModalInstance =  $modal.open({
            size: 'sm',
            templateUrl:'myLoginContent',
            controller: loginModalInstanceCtrl
        });
    };
    
    $scope.logout = function() {
        catsAPIservice.logout()
        .success(function (response) {
            state.loggedin = false;
            $scope.loggedin = state.loggedin;
            //loginSucccess("Logout succeeded");
        })
        .error(function (err) {
            errorAlert(err);
        });
    };
}).
controller('SearchController', function ($q, $scope, catsAPIservice, state, $modal, $log, $location) {

    // These must be read here, otherwise the list will be empty when
    // the browser 'back' button is pressed after viewing a single record
    $scope.searchResultsList = state.resultList;
    $scope.searchResultsListSize = state.resultListSize;
    $scope.searchTerm = state.searchTerm;

    // Call the partial search service
    $scope.search = function() {
        catsAPIservice.search(state.searchTerm).success(function (response) {
            $scope.searchTerm = state.searchTerm;
            $scope.searchResultsList = response;
            state.resultList = response;
            $scope.searchCount();
        });
    };
    
    // Call the partial search service
    $scope.searchCount = function() {
        catsAPIservice.searchSize(state.searchTerm).success(function (response) {
            $scope.searchResultsListSize = response;
            state.resultListSize = response;
        }).error(function (err) {
            $scope.searchResultsListSize = 0;
        });
    };
    
    //do this differently : ....or what
    
    $scope.loggedin = state.loggedin;
    
    $scope.$watch(
        // This is the listener function
        function() { return state.loggedin; },
        // This is the change handler
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                $scope.loggedin = state.loggedin;
            }
        }
    );
    
    // Clicking on a reference number will direct over to view mode
    // and save the sample details so the view controller can retrieve them
    $scope.viewSample = function(sample) {
        $location.path('/view');
        state.sample = sample;
        state.create = false;
    };

    // The actual search is triggered here by the 'searchRequested' flag
    // changing
    $scope.$watch(
            // This is the listener function
            function() { return state.searchRequested; },
            // This is the change handler
            function(newValue, oldValue) {
                if ( newValue === true ) {
                    $scope.search();
                    state.searchRequested = false;
                }
            }
    );

    $scope.registerClicked = function(sample) {
        
        state.registerRequested = true;
        state.sample = {};
        if (sample){
            state.sample = sample;
        } 
    };

    /* Delete a single sample record
     * */
    $scope.deleteClicked = function(sampleId) {
        
        catsAPIservice.delete(sampleId).success(function (response) {
            state.searchRequested = true; // Refresh search
            alert('Record deleted');
        });
    };

    /* Needed for older browsers which don't support click() on href's */
    var fakeClick = function(anchorObj) {
    	/*try to click*/
    	if (anchorObj.click){
    		anchorObj.click();
    	}else if(document.createEvent) {
    	/*don't ask (thankyou slashdot)*/	
    	    var evt = document.createEvent("MouseEvents"); 
    	    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
    	    var allowDefault = anchorObj.dispatchEvent(evt);
    	}
    }
    
    /* Generates an excel formatted file (xlsx) containing the search results
     * and triggers a file download
     * */
    var createExportDoc = function(searchTerm) {
    	
    	var blob = null;
    	var docType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        
        catsAPIservice.Excel(searchTerm).success(function (response) {

            /*package the newly generated spreadsheet data as blob we can use for file download*/
        	try{
                blob = new Blob([response], {type: docType});
    		}
    		catch(e){
    		    /* TypeError old chrome and FF*/
    		    window.BlobBuilder = window.BlobBuilder || 
    		                         window.WebKitBlobBuilder || 
    		                         window.MozBlobBuilder || 
    		                         window.MSBlobBuilder;
    		    
    		    if(e.name == 'TypeError' && window.BlobBuilder){
    		        var bb = new BlobBuilder();
    		        bb.append(response);
    		        blob = bb.getBlob(docType);
    		    }
    		    else if(e.name == "InvalidStateError"){
    		        /* InvalidStateError (tested on FF13 WinXP)*/
    		        blob = new Blob( [response], {type : docType});
    		    }
    		    else{
    		        /* TODO: handle error case  */
    		    	alert("Your browser doesn't support this. " +
    		    		  "Please try again with a more recent browser.");
    		    }
    		}
    		try {
    			var objectUrl = URL.createObjectURL(blob);
		    }
		    catch (e) {
		    	/*try again, some browsers support this syntax instead*/
		    	if(e.type == 'not_defined' && e.arguments[0] === 'URL'){
		    		var objectUrl = webkitURL.createObjectURL(blob);
		    	}
		    }
		    
            /* Create a reference and fake a click to start the download */
            var hiddenElement = document.createElement('a');
            hiddenElement.setAttribute('href', objectUrl);
            hiddenElement.setAttribute('download', "cats_export.xlxs");
            fakeClick(hiddenElement);
        });
        //TODO: add failure case
    }

    /* Fetches artwork details for a list of samples and 
     * adds them to the sample data. When all the responses
     * have been received, creates an excel doc.
     */
    $scope.exportClicked = function(searchTerm) {
        
        createExportDoc(searchTerm);

        
//        /*create a new unit of work by creating a Deferred object*/
//        var defer = $q.defer();
//        var promises = [];
//        
//        angular.forEach(samples, function(value){
//            if(value.artwork_id){
//                promises.push(catsAPIservice.readArtwork(value.artwork_id)
//                    .success(function (response) {
//                        /*extra sanity check*/
//                        if(value.artwork_id === response[0]._id){
//                            value.artwork = response[0];
//                        }
//                    })
//                    .error(function (err) {
//                        //TODO: add failure case
//                    })
//                );
//            }
//        });
//
//        /*When all the responses are home, then build the report*/
//        $q.all(promises).then(function(results){
//            defer.resolve();
//            createExportDoc(samples);
//        });
    }
}).
controller('BrowseController', function ($scope) {

}).
controller('ViewController', function ($scope, state, catsAPIservice) {

    /* Retrieve the sample details from the state service*/
    $scope.record = state.sample;

    $scope.statusMeta = {
            isFirstOpen: true,
            isFirstDisabled: false
    };

}).
controller('DatepickerCntrl', function ($scope) {
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            datepickerMode: 'day'
    };

    $scope.initDate = new Date('1970-01-01T01:00:00.000Z');
    $scope.formats = ['dd/MM/yyyy'];
    $scope.format = $scope.formats[0];
}).
controller('RegisterCtrl', function ($scope, $modal, $log, state, catsAPIservice) {

    $scope.lists = {};

    $scope.lists.artwork = {};

    $scope.lists.layerTypes = 
        [{id: '1', name: 'Ground', dkname:'', grp:''},
         {id: '2', name: 'Imprimatura', dkname:'', grp:''},
         {id: '3', name: 'Paint', dkname:'', grp:''},
         {id: '4', name: 'Varnish', dkname:'', grp:''}];

    $scope.lists.analysisTypes = 
        [{id: '1', name: 'Automated thread count'},
         {id: '2', name: 'C14'},
         {id: '3', name: 'Dendrochronology'},
         {id: '4', name: 'FTIR'},
         {id: '5', name: 'GC-MS'},
         {id: '6', name: 'HPLC'},
         {id: '7', name: 'IRR'},
         {id: '8', name: 'Microscopy'},
         {id: '9', name: 'Other'},
         {id: '10', name: 'Photographic'},
         {id: '11', name: 'Polar. Micro.'},
         {id: '12', name: 'Raman'},
         {id: '13', name: 'SEM/EDX'},
         {id: '14', name: 'Visual'},
         {id: '15', name: 'Weave mapping'},
         {id: '16', name: 'Wood identification'},
         {id: '17', name: 'X-radiography'},
         {id: '18', name: 'XRF'}];

    $scope.lists.fibreTypes = [{id: '1', name: 'blend'},
                               {id: '2', name: 'cellulose (wooden)'},
                               {id: '3', name: 'cotton'},
                               {id: '4', name: 'hemp'},
                               {id: '5', name: 'linen'},
                               {id: '6', name: 'other'},
                               {id: '7', name: 'synthetic'}];	

    $scope.lists.fibreGlueTypes = [{id: '1', name: 'animal'},
                                   {id: '2', name: 'synthetic'},
                                   {id: '3', name: 'vegetable'}];	

    $scope.lists.sampleOwners = [{id: '1', name: 'National Museum of Denmark'},
                                 {id: '2', name: 'School of Conservation'},
                                 {id: '3', name: 'Statens Museum for Kunst (SMK)'}];

    $scope.lists.materialTypes = 
        [{id: '1', name: 'glass', dkname:'glas', grp:''},
         {id: '2', name: 'bisque', dkname:'biskuit', grp:'Ceramical'},
         {id: '2', name: 'chamotte', dkname:'chamotte', grp:'Ceramical'},
         {id: '2', name: 'earthenware', dkname:'brændt ler', grp:'Ceramical'},
         {id: '2', name: 'faience', dkname:'fajance', grp:'Ceramical'},
         {id: '2', name: 'pipeclay', dkname:'pipeler', grp:'Ceramical'},
         {id: '2', name: 'plastiline', dkname:'plastilin', grp:'Ceramical'},
         {id: '2', name: 'porcelain', dkname:'porcelæn', grp:'Ceramical'},
         {id: '2', name: 'raku', dkname:'raku', grp:'Ceramical'},
         {id: '2', name: 'roche céramique', dkname:'roche céramique', grp:'Ceramical'},
         {id: '2', name: 'stoneware', dkname:'stentøj', grp:'Ceramical'},
         {id: '2', name: 'terra-cotta', dkname:'terrracotta', grp:'Ceramical'},
         {id: '2', name: 'unfired clay', dkname:'ubrændt ler', grp:'Ceramical'},
         {id: '2', name: 'canvas', dkname:'lærred', grp:''},
         {id: '2', name: 'aluminum', dkname:'aluminium)', grp:'Metals'},
         {id: '2', name: 'bronze', dkname:'bronze', grp:'Metals'},
         {id: '2', name: 'copper', dkname:'kobber', grp:'Metals'},
         {id: '2', name: 'gold', dkname:'guld', grp:'Metals'},
         {id: '2', name: 'iron', dkname:'jern', grp:'Metals'},
         {id: '2', name: 'lead', dkname:'bly', grp:'Metals'},
         {id: '2', name: 'leaf gold', dkname:'bladguld', grp:'Metals'},
         {id: '2', name: 'ore', dkname:'malm', grp:'Metals'},
         {id: '2', name: 'pewter', dkname:'tin', grp:'Metals'},
         {id: '2', name: 'silver', dkname:'sølv', grp:'Metals'},
         {id: '2', name: 'tin', dkname:'blik', grp:'Metals'},
         {id: '2', name: 'zinc', dkname:'zink', grp:'Metals'},
         {id: '2', name: 'organic material', dkname:'organisk materiale', grp:''},
         {id: '2', name: 'pigment scraping', dkname:'pigmentskrab', grp:''},
         {id: '2', name: 'acrylate', dkname:'akryl', grp:'Synthetic'},
         {id: '2', name: 'glass fibre', dkname:'glasfiber', grp:'Synthetic'},
         {id: '2', name: 'plastic', dkname:'plast', grp:'Synthetic'},
         {id: '2', name: 'polyester', dkname:'polyester', grp:'Synthetic'},
         {id: '2', name: 'polyurethane foam', dkname:'polyurethanskum', grp:'Synthetic'},
         {id: '2', name: 'polyvinyl chloride', dkname:'pvc', grp:'Synthetic'},
         {id: '2', name: 'ash', dkname:'ask', grp:'Wood'},
         {id: '2', name: 'beech', dkname:'bøgetræ', grp:'Wood'},
         {id: '2', name: 'birch', dkname:'birketræ', grp:'Wood'},
         {id: '2', name: 'boxwood', dkname:'buksbom', grp:'Wood'},
         {id: '2', name: 'Brazilian rosewood', dkname:'palisander', grp:'Wood'},
         {id: '2', name: 'ebony', dkname:'ibenholt', grp:'Wood'},
         {id: '2', name: 'elm', dkname:'elmetræ', grp:'Wood'},
         {id: '2', name: 'lime', dkname:'lindetræ', grp:'Wood'},
         {id: '2', name: 'mable', dkname:'ahorn', grp:'Wood'},
         {id: '2', name: 'mahogany', dkname:'mahogni', grp:'Wood'},
         {id: '2', name: 'nut', dkname:'nøddetræ', grp:'Wood'},
         {id: '2', name: 'oak', dkname:'egetræ', grp:'Wood'},
         {id: '2', name: 'pine', dkname:'fyr/pinjetræ', grp:'Wood'},
         {id: '2', name: 'poplar', dkname:'poppeltræ', grp:'Wood'},
         {id: '2', name: 'sandalwood', dkname:'sandeltræ', grp:'Wood'},
         {id: '2', name: 'teak', dkname:'teaktræ', grp:'Wood'},
         {id: '2', name: 'walnut', dkname:'valnøddetræ', grp:'Wood'},
         {id: '2', name: 'willow', dkname:'piletræ', grp:'Wood'}]; 	

    $scope.lists.paintBinders = [{id: '1', name: 'casin', dkname: 'kasein', grp:''},
                                 {id: '2', name: 'emulsion', dkname: 'emulsion', grp:''},
                                 {id: '3', name: 'glue', dkname: 'lim', grp:'Glue'},
                                 {id: '4', name: 'animal glue', dkname: 'lim animalisk', grp:'Glue'},
                                 {id: '5', name: 'vegetable glue', dkname: 'lim vegetabilsk', grp:'Glue'},
                                 {id: '6', name: 'oil', dkname: 'olie', grp:'Oil'},
                                 {id: '7', name: 'linseed oil', dkname: 'linolie', grp:'Oil'},
                                 {id: '8', name: 'poppy oil', dkname: 'valmulie', grp:'Oil'},
                                 {id: '9', name: 'walnut oil', dkname: 'valnøddolie', grp:'Oil'},
                                 {id: '10', name: 'resin', dkname: 'harpiks', grp:''},
                                 {id: '11', name: 'synthetic', dkname: 'syntetisk', grp:''}];

    $scope.lists.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)', grp:'Physical samples'},
                                {id: 'material', name: 'Material Sample', grp:'Physical samples'},
                                {id: 'paint', name: 'Paint Cross Section', grp:'Physical samples'},
                                {id: 'pigment', name: 'Pigment', grp:'Physical samples'},
                                {id: 'stretcher', name: 'Stretcher/Strainer', grp:'Physical samples'},
                                {id: 'noninvasive', name: 'Non-invasive analysis (no sample)', grp:'Non invasive methods'}];

    $scope.lists.mediaTypes = [{id: '1', name: 'black-and-white negative film', grp:''},
                               {id: '2', name: 'dias', grp:''},
                               {id: '3', name: 'analogue IR film', grp:'IR'},
                               {id: '4', name: 'Digital Artist', grp:'IR'},
                               {id: '5', name: 'Digital Osiris', grp:'IR'},
                               {id: '6', name: 'IR vidicon ', grp:'IR'}];

    $scope.lists.mediaFilms = [{id: '1', name: 'Dowie'},
                               {id: '2', name: 'EPD120'},
                               {id: '3', name: 'FP4'},
                               {id: '4', name: 'FP special'},
                               {id: '5', name: 'HP3'},
                               {id: '6', name: 'IR-HS'},
                               {id: '7', name: 'Kodak IR-ER'},
                               {id: '8', name: 'Kodak IR.HS4143'}];

    $scope.lists.mediaFormats = [{id: '1', name: '4 x 4'},
                                 {id: '2', name: '4 x 5'},
                                 {id: '3', name: '6 x 6'},
                                 {id: '4', name: '24 x 36'}];

    $scope.lists.mediaFilters = [{id: '1', name: 'Kodak Wratten 2B'},
                                 {id: '2', name: 'Kodak Wratten 2E'},
                                 {id: '3', name: 'Kodak Wratten 87'},
                                 {id: '4', name: 'Kodak Wratten 87C'},
                                 {id: '5', name: 'Kodak Wratten 88A'},
                                 {id: '6', name: 'polarization filter'},
                                 {id: '7', name: 'Schott UG-12'}];

    $scope.lists.mediaLightings = [{id: '1', name: 'natural'},
                                   {id: '2', name: 'regular'},
                                   {id: '3', name: 'side light'},
                                   {id: '4', name: 'sodium light'},
                                   {id: '5', name: 'symmetrical light'},
                                   {id: '6', name: 'tangential light'},
                                   {id: '7', name: 'UV flourescence'},
                                   {id: '8', name: 'UV reflected'}];

    $scope.lists.mediaScopes = [{id: '1', name: 'back'},
                                {id: '2', name: 'detail'},
                                {id: '3', name: 'front'},
                                {id: '4', name: 'total'}];  	

    $scope.lists.xrayTypes = [{id: '1', name: 'analogue'},
                              {id: '2', name: 'digital'},
                              {id: '3', name: 'scan'}];

    $scope.lists.xrayFilmTypes = [{id: '1', name: '30 x 40 cm'},
                                  {id: '2', name: 'Repro film'}];

    $scope.lists.xrayFilters = [{id: '1', name: 'aluminium'},
                                {id: '2', name: 'iron'},
                                {id: '3', name: 'copper'}];

    $scope.lists.stretcherConditions = 
        [{id: '1', name: 'complete', dkname: 'komplet'},
         {id: '2', name: 'fragment', dkname: 'fragment'}];

    $scope.lists.stretcherTypes = 
        [{id: '1', name: 'strainer', dkname: 'spændramme'},
         {id: '2', name: 'stretcher', dkname: 'kileramme'},
         {id: '3', name: 'with horizontal cross bar', dkname: 'med tværsprosse'},
         {id: '4', name: 'with intersecting cross bars', dkname: 'med kryds'},
         {id: '5', name: 'with double intersecting cross bars', dkname: 'med dobbelt kryds'}];

    $scope.lists.stretcherJointTechniques = 
        [{id: '1', name: 'bridle joint', dkname: 'slids'},
         {id: '2', name: 'mitered bridle joint', dkname: 'slids med gering'},
         {id: '3', name: 'lap joint', dkname: 'bladsamling'},
         {id: '4', name: 'pinned', dkname: 'med dyveler'},
         {id: '5', name: 'with reinforcement', dkname: 'med forstærkningsplade'},
         {id: '6', name: 'other', dkname: 'anden'}];

    $scope.lists.stretcherMaterialTypes = 
        [{id: '1', name: 'hardwood', dkname: 'løvtræ'},
         {id: '2', name: 'softwood ', dkname: 'nåletræ'}];

    $scope.lists.pigmentForms = 
        [{id: '1', name: 'chunk', dkname: 'stykke'},
         {id: '2', name: 'crystal', dkname: 'krystal'},
         {id: '3', name: 'flakes', dkname: 'flager'},
         {id: '4', name: 'powder', dkname: 'pulver'},
         {id: '5', name: 'stone', dkname: 'sten'},
         {id: '6', name: 'bound to textile', dkname: 'tekstil'}];

    $scope.lists.pigmentContainers = 
        [{id: '1', name: 'glass container', dkname: 'glasbeholder'},
         {id: '2', name: 'microscope slide', dkname: 'objektglas'},
         {id: '2', name: 'original container', dkname: 'originalemballage'},
         {id: '2', name: 'paper', dkname: 'papir'},
         {id: '2', name: 'plastic container', dkname: 'plastikbeholder'}];

    $scope.lists.colours =
        [{id: '1', name: 'black', dkname:'sort', grp:''},
         {id: '2', name: 'blue', dkname:'blå', grp:''},
         {id: '3', name: 'brown', dkname:'brun', grp:''},
         {id: '4', name: 'green', dkname:'grøn', grp:''},
         {id: '5', name: 'grey', dkname:'grå', grp:''},
         {id: '6', name: 'orange', dkname:'orange', grp:''},
         {id: '7', name: 'purple', dkname:'lilla', grp:''},
         {id: '8', name: 'red', dkname:'rød', grp:''},
         {id: '9', name: 'white', dkname:'hvid', grp:''},
         {id: '10', name: 'yellow', dkname:'gul', grp:''}];

    $scope.lists.pigments =
        [{id: '1', name: 'bone black', dkname:'bensort', grp:''},
         {id: '2', name: 'chalk', dkname:'kridt', grp:''},
         {id: '3', name: 'lamp black', dkname:'trækulsort', grp:''},
         {id: '4', name: 'lead white', dkname:'blyhvidt', grp:''},
         {id: '5', name: 'plaster', dkname:'gips', grp:''},
         {id: '6', name: 'red ocher', dkname:'rød okker', grp:'Earth colours'},
         {id: '7', name: 'yellow ocher', dkname:'gul okker', grp:'Earth colours'},
         {id: '8', name: 'titanium white', dkname:'titanhvidt', grp:''},
         {id: '9', name: 'vine black', dkname:'sodsort', grp:''},
         {id: '10', name: 'zinc white', dkname:'zinkhvidt', grp:''}];

    $scope.lists.dyes =
        [{id: '1', name: 'asphalt', dkname:'asfalt', grp:''},
         {id: '2', name: 'indigo', dkname:'indigo', grp:''},
         {id: '3', name: 'unknown organic brown', dkname:'brun organisk - ubestemt', grp:'Organic brown'},
         {id: '4', name: 'brazilwood', dkname:'brasiltræ', grp:'Organic red'},
         {id: '5', name: 'cocheneal', dkname:'cochenille', grp:'Organic red'},
         {id: '6', name: 'krap', dkname:'krap', grp:'Organic red'},
         {id: '7', name: 'unknown organic red', dkname:'rød organisk - ubestemt', grp:'Organic red'},
         {id: '8', name: 'unknown organic yellow', dkname:'gul organisk - ubestemt', grp:'Organic yellow'}];

    $scope.lists.mainTabs = { tabOneState : true};
    $scope.lists.submitted = false;
    $scope.lists.alerts = [];
    $scope.lists.createAnother = false;

    // open the modal dialog
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent',
            controller: ModalInstanceCtrl,
            size: size,
            backdrop: 'static',
            resolve:{
                lists: function () {
                    return $scope.lists;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    /* catch the registerRequested event and
     * open the modal window
     */
    $scope.$watch(
        // This is the listener function
        function() { return state.registerRequested; },
        // This is the change handler
        function(newValue, oldValue) {
            if ( newValue === true ) {
                if(state.sample){
                    /*existing sample record*/
                    $scope.lists.record = state.sample;
                }
                $scope.open('lg'); /*pass size*/
                state.registerRequested = false;
            }
        }
    );
})

var loginModalInstanceCtrl = function ($scope, $modalInstance, state, $timeout, catsAPIservice) {

    $scope.alerts = [];

    $scope.login = function (form, email, password) {

        /* show required fields only after a save attempt */
        $scope.submitted = true;

        if (form.$invalid){
            missingAlert();
            return;
        }
        
        /*Perform authentication*/
        catsAPIservice.login(email, password)
        .success(function (response) {
            state.loggedin = true;
            loginSucccess("Login succeeded");
        })
        .error(function (err) {
            errorAlert(err);
        });
        
    };

    var loginSucccess = function(message) {

        $scope.alerts.push({type: 'success', msg: message, icon: 'glyphicon glyphicon-ok'});

        $timeout(function(){
            $scope.alerts.splice(0, 1);
            $modalInstance.close();
        }, 3000);
    };
    
    var missingAlert = function() {

       $scope.alerts.push({type: 'danger', msg: 'Missing email or password', 
                           icon: 'glyphicon glyphicon-warning-sign'});
        $timeout(function(){
            $scope.alerts.splice(0, 1);
        }, 3000);
    };
    
    var errorAlert = function() {

        $scope.alerts.push({type: 'danger', msg: 'Wrong user or password', 
                            icon: 'glyphicon glyphicon-warning-sign'});
         $timeout(function(){
             $scope.alerts.splice(0, 1);
         }, 3000);
     };

    $scope.closeAlert = function(index) {

        $scope.alerts.splice(index, 1);
    };
}

// Please note that $modalInstance represents a modal window (instance)
// dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function ($timeout, $scope, $modalInstance, lists, catsAPIservice, state) {

    var resetRecord = function() {
        $scope.record = {};
        
        /*create initial tabs*/
        $scope.record.paintLayer = [{id: "1", layerType: "", paintBinder: [], colour: "", 
                                    pigment: "", dye: "", active: true}];
        $scope.record.sampleAnalysis = [{id: "1", type: "", description:"", referenceNumber:"", 
                                        date:"", employee:"", owner:"", originLocation:"", 
                                        location:"", results:"", active: true}];
        /*TODO: reset all list values too*/
    };
    
    if(lists.record._id) {
        $scope.record = lists.record;
    }
    else {	
        resetRecord();
    }
    
    $scope.artwork = lists.artwork;
    $scope.sampleTypes = lists.sampleTypes;
    $scope.colours = lists.colours;
    $scope.pigments = lists.pigments;
    $scope.dyes = lists.dyes;		
    $scope.layerTypes = lists.layerTypes;
    $scope.fibreTypes = lists.fibreTypes;	
    $scope.paintBinders = lists.paintBinders;
    $scope.fibreGlueTypes = lists.fibreGlueTypes;
    $scope.materialTypes = lists.materialTypes;
    $scope.sampleOwners = lists.sampleOwners;	
    $scope.analysisTypes = lists.analysisTypes;
    $scope.stretcherTypes = lists.stretcherTypes;
    $scope.stretcherConditions = lists.stretcherConditions;
    $scope.stretcherJointTechniques = lists.stretcherJointTechniques;
    $scope.stretcherMaterialTypes = lists.stretcherMaterialTypes;
    $scope.pigmentForms = lists.pigmentForms;
    $scope.pigmentContainers = lists.pigmentContainers;	
    $scope.xrayTypes = lists.xrayTypes;	
    $scope.xrayFilmTypes = lists.xrayFilmTypes;
    $scope.xrayFilters = lists.xrayFilters;
    $scope.mediaTypes = lists.mediaTypes;
    $scope.mediaFilms = lists.mediaFilms;
    $scope.mediaFormats = lists.mediaFormats;
    $scope.mediaFilters = lists.mediaFilters;
    $scope.mediaLightings = lists.mediaLightings;
    $scope.mediaScopes = lists.mediaScopes;
    $scope.mainTabs = lists.mainTabs;
    $scope.submitted = lists.submitted;
    $scope.alerts = lists.alerts;
    $scope.createAnother = lists.createAnother;


    /* START tabs for paint layers */
    var setAllInactive = function() {
        angular.forEach($scope.record.paintLayer, function(paintLayer) {
            paintLayer.active = false;
        });
    };

    var addNewLayer = function() {
        var id = $scope.record.paintLayer.length + 1;
        $scope.record.paintLayer.push({id: id, layerType: "", paintBinderbinder: [], colour: "", pigment: "", dye: "",  active: true});
    };

    $scope.addLayer = function () {
        setAllInactive();
        addNewLayer();
    };

    $scope.removeLayerTab = function (index) {
        $scope.record.paintLayer.splice(index, 1);
    };
    /* END tabs for paint layers */

    /* START tabs for xray */
    var setAllInactive = function() {
        angular.forEach($scope.record.xrayGroup, function(xrayGroup) {
            xrayGroup.active = false;
        });
    };

    var addNewXray = function() {
        var id = $scope.record.xrayGroup.length + 1;
        $scope.record.xrayGroup.push({id: id, kv: "", ma:"", time: "", focus: "", distance: "", filter: "", test: false, active: true});
    };

    $scope.addXray = function () {
        setAllInactive();
        addNewXray();
    };

    $scope.removeXrayTab = function (index) {
        $scope.record.xrayGroup.splice(index, 1);
    };
    /* END tabs for Xray */

    /* START tabs for analysis */
    var setAllAnalysisInactive = function() {
        angular.forEach($scope.record.sampleAnalysis, function(sampleAnalysis) {
            sampleAnalysis.active = false;
        });
    };

    var addNewAnalysis = function() {
        var id = $scope.record.sampleAnalysis.length + 1;
        $scope.record.sampleAnalysis.push({id: id, sampleAnalysisType: "", sampleAnalysisDescription:"", active: true});
    };

    $scope.addAnalysis = function () {
        setAllAnalysisInactive();
        addNewAnalysis();
    };

    $scope.removeAnalysisTab = function (index) {
        $scope.record.sampleAnalysis.splice(index, 1);
    };
    /* END tabs for paint layers */

    $scope.selected = {sampleType: $scope.sampleTypes[0]};

    /* This function is used for testing, if the button is enabled in search.jade (ng-show="true")
     * then we can clear artworks
     * */
    $scope.clearArtwork = function () {
        $scope.record.artwork = {};
    };

    /* This function is used for testing, if the button is enabled in search.jade (ng-show="true")
     * then we can save artworks without associating them with a sample.
     * */
    $scope.addArtwork = function (artwork) {

        catsAPIservice.createArtwork(artwork)
        .success(function (response) {
            alert('Artwork saved');
        })
        .error(function (err) {
            alert(err);
        });
    };

    /* Notifications
     * 
     * Should really disable the whole modal during some notification timeouts
     */
    var invalidAlert = function() {

        $scope.alerts.push({type: 'danger', msg: 'Save failed. Please correct the highlighted ' +
        'fields and try again.', icon: 'glyphicon glyphicon-warning-sign'});
        $timeout(function(){
            $scope.alerts.splice(0, 1);
        }, 5000);
    };

    var saveFailed = function(message) {

        $scope.alerts.push({type: 'danger', msg: message, icon: 'glyphicon glyphicon-warning-sign'});
        $timeout(function(){
            $scope.alerts.splice(0, 1);
        }, 5000);
    };

    var recordSaved = function(message) {

        $scope.alerts.push({type: 'success', msg: message, icon: 'glyphicon glyphicon-ok'});

        $timeout(function(){
            $scope.alerts.splice(0, 1);
            if ($scope.createAnother === false){
                $modalInstance.close($scope.selected.sampleType);
            }
            else{
                /* clear the form */
                $scope.submitted = false;
                resetRecord();
                /* TODO: and the rest.... */
            }
        }, 3000);
    };

    $scope.closeAlert = function(index) {

        $scope.alerts.splice(index, 1);
    };
    
    var saveSample = function (record) {
        
        /* we copy to 'rec' because if we just use the original
         * ($scope.record) then the fields disappear immediately in the UI whilst the status
         * indicator times out. (We delete the artwork fields because we don't
         * want to send them to the sample record as well)
         * */
        var rec = JSON.parse(JSON.stringify(record)); /*quick cheat to copy a simple json object*/
        delete rec.artwork;
        
        catsAPIservice.createSample(rec)
        .success(function (response) {
            recordSaved('Record saved');
        })
        .error(function (err) {
            var message = "Save Sample failed ";
            message += (err) ? "(" + err + ")" : "";
            saveFailed(message);
        });
        state.searchRequested = true; /*refresh search results*/
    };
    
    var saveArtworkAndSample = function () {

        catsAPIservice.createArtwork($scope.record.artwork)
            .success(function (response) {
                $scope.record.artwork_id = response._id; /*id of artwork we've just created, or updated*/
                saveSample($scope.record);  //TODO move to server
            })
            .error(function (err) {
                var message = "Save Artwork & Sample failed ";
                message += (err) ? "(" + err + ")" : "";
                saveFailed(message);
            });
    }

    /* This saves a sample record and optionally an artwork
     * */
    $scope.register = function (formInvalid) {

        /* show required fields only after a save attempt */
        $scope.submitted = true;

        if (formInvalid){
            invalidAlert();
            /* the only required fields are on the first tab so move the user to it */
            $scope.mainTabs.tabOneState = true; 
            return;
        }
        if ($scope.record.artwork && $scope.record.artwork.inventoryNum){
            saveArtworkAndSample();
        }else{
            $scope.record.artwork_id = "";
            saveSample($scope.record);
        }
    };

    $scope.ok = function () {

        $modalInstance.close($scope.selected.sampleType);
        state.searchRequested = true;
    };

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
        state.searchRequested = true;
    };
};

function CarouselImageCtrl($scope) {

    $scope.myInterval = -1;

    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/600',
            text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };

    for (var i=0; i<4; i++) {
        $scope.addSlide();
    }
};

function ImageUploadCtrl($scope) {
    
    $scope.data = 'none';

    $scope.add = function(){
        var f = document.getElementById('file').files[0],
        r = new FileReader();
        r.onloadend = function(e){
            $scope.data = e.target.result;
        }
        r.readAsBinaryString(f);
    }
}