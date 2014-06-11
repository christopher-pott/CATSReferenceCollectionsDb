'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ui.bootstrap']).
controller('AppCtrl', function ($scope, $http, state, $location) {

	$http({
		method: 'GET',
		url: '/api/name'
	}).
	success(function (data, status, headers, config) {
		$scope.name = data.name;
	}).
	error(function (data, status, headers, config) {
		$scope.name = 'Error!';
	});
	$scope.searchClicked = function(searchTerm) {
		$location.path('/search');
		state.searchTerm = searchTerm;
		state.searchRequested = true;
	};

}).
controller('SearchController', function ($scope, catsAPIservice, state, $modal, $log) {

	$scope.searchResultsList = state.resultList;
	$scope.searchTerm = state.searchTerm;

	$scope.search = function() {
		catsAPIservice.search(state.searchTerm).success(function (response) {
			$scope.searchResultsList = response;
			state.resultList = response;
		});
	};
	$scope.viewSample = function(sample) {
		//alert('sample : ' + refNum);
		state.sample = sample;
		state.create = false;
	};
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
	$scope.registerClicked = function() {
		state.registerRequested = true;
	};
}).
controller('BrowseController', function ($scope) {
	// write Ctrl here

}).
controller('ViewController', function ($scope, state, catsAPIservice) {
	$scope.alerts = [];

	$scope.sampleTypes = 
		[{id: 'fibre', name: 'Fibre(paper)'},
	     {id: 'paint', name: 'Paint Cross Section'},
	     {id: 'material', name: 'Material'},
	     {id: 'pigment', name: 'Pigment'},
	     {id: 'stretcher', name: 'Stretcher'},
	     {id: 'xray', name: 'Xray'},
	     {id: 'photograph', name: 'photograph'},
	     {id: 'infrared', name: 'infrared'}];
	
	$scope.groundTypes = 
		[{id: 'onelayer', name: '1-layer'},
	     {id: 'twolayer', name: '2-layer'},
	     {id: 'colour', name: 'colour'}];	
	
	$scope.groundMaterials =
		[{id: '1', name: 'ground material'},
	    {id: '2', name: 'another ground material'},
	    {id: '3', name: 'ground material 3'},
	    {id: '4', name: 'ground material 4'},
	    {id: '5', name: 'ground material 5'},
	    {id: '6', name: 'ground material 6'},
	    {id: '7', name: 'yet another ground material'}];	
	
	if (state.create){
		$scope.record = {sampleType: "",
				referenceNumber: "", 
				originLocation: "",
				sampleDate: "", 
				employee: "",
				owner: "",
				sampleLocation: "",
				remarks: "",
				ramanAnalysis: "",
				ftirAnalysis: "",
				gcmsChromatagrams: ""};
	}else{
		$scope.record = state.sample;  
	}

	$scope.register = function() {
		catsAPIservice.create($scope.record).success(function (response) {
		//	alert('Record saved');
		//	$scope.alert = { type: 'success', msg: 'Record saved' };
			 $scope.alerts.push({ type: 'success', msg: 'Record saved' });
		});
	};

	$scope.getSample = function() {
		$scope.record = {sampleType: {id: "paint", name: "Paint"},
				referenceNumber: "777", 
				originLocation: "",
				sampleDate: "", 
				employee: "chris",
				owner: "",
				sampleLocation: "",
				remarks: "cat",
				ramanAnalysis: "",
				ftirAnalysis: "",
				gcmsChromatagrams: ""};
	};
//
//	$scope.addAlert = function() {
//		$scope.alerts.push({type: 'success', msg: 'Record saved'});
//	};	
	$scope.closeAlert = function(index) {
		 $scope.alerts.splice(index, 1);
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

	  $scope.initDate = new Date('2016-15-20');
	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
}).
controller('RegisterCtrl', function ($scope, $modal, $log, state) {

	$scope.lists = {};

	$scope.lists.layerTypes = [{id: '1', name: 'Ground', dkname:'', grp:''},
	  	                      {id: '2', name: 'Imprimatura', dkname:'', grp:''},
	  	                      {id: '3', name: 'Varnish', dkname:'', grp:''},
	  	                      {id: '4', name: 'Paint', dkname:'', grp:''}];

	$scope.lists.analysisTypes = [{id: '1', name: 'C14'},
		  	                      {id: '2', name: 'FTIR'},
		  	                      {id: '3', name: 'GC-MS'},
		  	                      {id: '4', name: 'HPLC'},
		  	                      {id: '5', name: 'IRR'},
		  	                      {id: '6', name: 'Microscopy'},
		  	                      {id: '7', name: 'Photographic'},
		  	                      {id: '8', name: 'Polar. Micro.'},
		  	                      {id: '9', name: 'Raman'},
		  	                      {id: '10', name: 'SEM/EDX'},
		  	                      {id: '11', name: 'Visual'},
		  	                      {id: '12', name: 'X-radiography'},
		  	                      {id: '13', name: 'XRF'},
		  	                      {id: '14', name: 'Other'}];	
	
	$scope.lists.fibreTypes = [{id: '1', name: 'Cellulose (wooden)'},
	   	                      {id: '2', name: 'Cotton'},
	  	                      {id: '3', name: 'Hemp'},
	  	                      {id: '4', name: 'Linen'},
	  	                      {id: '5', name: 'Synthetic'},
	  	                      {id: '6', name: 'Blend'},
	  	                      {id: '7', name: 'Other'}];	

	$scope.lists.fibreGlueTypes = [{id: '1', name: 'Animal'},
	  	                           {id: '2', name: 'Synthetic'},
	  	                           {id: '3', name: 'Vegetable'}];	
	
	$scope.lists.sampleOwners = [{id: '1', name: 'National Museum of Denmark'},
	  	                      {id: '2', name: 'School of Conservation'},
	  	                      {id: '3', name: 'Statens Museum for Kunst (SMK)'}];

	$scope.lists.groundTypes = [{id: 'onelayer', name: '1-layer'},
	                      {id: 'twolayer', name: '2-layer'},
	                      {id: 'colour', name: 'Colour'}];
	
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

	$scope.lists.artworks = [{id: '1', name: 'KMS8050'},
	  	                      {id: '2', name: 'KKShm2345 verso'},
	  	                      {id: '3', name: 'DEP620'}];

	$scope.lists.paintBinders = [{id: '1', name: 'Casin', dkname: 'kasein', grp:''},
	  	                      {id: '2', name: 'Emulsion', dkname: 'emulsion', grp:''},
	  	                      {id: '3', name: 'Animal glue', dkname: 'lim animalisk', grp:'Glue'},
	  	                      {id: '4', name: 'Vegetable glue', dkname: 'lim vegetabilsk', grp:'Glue'},
	  	                      {id: '5', name: 'Linseed oil', dkname: 'linolie', grp:'Oil'},	
	  	                      {id: '6', name: 'Poppy oil', dkname: 'valmulie', grp:'Oil'},
	  	                      {id: '7', name: 'Walnut oil', dkname: 'valnøddolie', grp:'Oil'},
	  	                      {id: '8', name: 'Resin', dkname: 'harpiks', grp:'Oil'},
	  	                      {id: '9', name: 'Synthetic', dkname: 'syntetisk', grp:'Oil'}];

	$scope.lists.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)'},
	                      {id: 'material', name: 'Material Sample'},
	                      {id: 'photograph', name: 'Media (photography)'},
	                      {id: 'paint', name: 'Paint Cross Section'},
	                      {id: 'pigment', name: 'Pigment'},
	                      {id: 'stretcher', name: 'Stretcher/Strainer'},
	                      {id: 'xray', name: 'X-radiography'}];

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
		 {id: '4', name: 'with reinforcement', dkname: 'med forstærkningsplade'},
		 {id: '5', name: 'other', dkname: 'anden'}];
	
	$scope.lists.stretcherMaterialTypes = 
		[{id: '1', name: 'hardwood', dkname: 'løvtræ'},
		 {id: '2', name: 'softwood ', dkname: 'nåletræ'}];
	
	$scope.lists.pigmentForms = 
		[{id: '1', name: 'chunk', dkname: 'stykke'},
		 {id: '2', name: 'crystal', dkname: 'krystal'},
		 {id: '3', name: 'flakes', dkname: 'flager'},
		 {id: '4', name: 'powder', dkname: 'pulver'},
		 {id: '5', name: 'stone', dkname: 'sten'}];
	
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
		    {id: '6', name: 'red ocher', dkname:'rød okker', grp:'Soil colours'},
		    {id: '7', name: 'yellow ocher', dkname:'gul okker', grp:'Soil colours'},
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
	
	
	//open the modal dialog
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
	
	//this will call the open function
    $scope.$watch(
        // This is the listener function
        function() { return state.registerRequested; },
        // This is the change handler
        function(newValue, oldValue) {
        	if ( newValue === true ) {
        		$scope.open('lg');
        		state.registerRequested = false;
        	}
        }
    );
});

	// Please note that $modalInstance represents a modal window (instance) dependency.
	// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, lists, catsAPIservice) {

	$scope.createAnother = false;
	
	$scope.record = {
			sampleType: "",
			referenceNumber: "", 
			originLocation: "",
			sampleDate: "", 
			employee: "",
			owner: "",
			sampleLocation: "",
			remarks: "",
			ramanAnalysis: "",
			ftirAnalysis: "",
			gcmsChromatagrams: "",
			paintLayer:[{id: "1", layerType: "", groundType:"", paintBinder: [], colour: "", pigment: "", dye: "", active: true}],
			sampleAnalysis:[{id: "1", sampleAnalysisType: "", sampleAnalysisDescription:"", active: true}],
			relatedartworks:[{id: "1", refnumber: "",  title: "Title", artist: "", technique: "", dimensions: "", productiondate: "", owner: "", active: true}],
			xrayGroup:[{id: "1", kv: "", ma:"", time: "", focus: "", distance: "", filter: "", test: false, active: true}]
	};
	
	$scope.sampleTypes = lists.sampleTypes;
	$scope.groundTypes = lists.groundTypes;
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
	$scope.artworks = lists.artworks;
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
		
	/*START tabs for paint layers*/
    var setAllInactive = function() {
        angular.forEach($scope.record.paintLayer, function(paintLayer) {
            paintLayer.active = false;
        });
    };
	
    var addNewLayer = function() {
    	var id = $scope.record.paintLayer.length + 1;
        $scope.record.paintLayer.push({id: id, layerType: "", groundType:"", paintBinderbinder: [], colour: "", pigment: "", dye: "",  active: true});
    };

    $scope.addLayer = function () {
        setAllInactive();
        addNewLayer();
    };
   
    $scope.removeLayerTab = function (index) {
        $scope.record.paintLayer.splice(index, 1);
    };
    /*END tabs for paint layers*/
    
	/*START tabs for xray*/
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
    /*END tabs for Xray */
    
	/*START tabs for analysis*/
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
    /*END tabs for paint layers*/    
    
	/*START tabs for artworks*/
    var setAllArtworksInactive = function() {
        angular.forEach($scope.record.relatedartworks, function(relatedartworks) {
        	relatedartworks.active = false;
        });
    };
	
    var addNewArtwork = function() {
    	var id = $scope.record.relatedartworks.length + 1;
        $scope.record.relatedartworks.push({id: id, refnumber: "",  title: "", artist: "", technique: "", dimensions: "", productiondate: "", owner: "", active: true});
    };
    
    $scope.addArtwork = function () {
        setAllArtworksInactive();
        addNewArtwork();
    };
    /*END tabs for artworks*/    
    
	$scope.selected = {
		sampleType: $scope.sampleTypes[0]
	};
	$scope.register = function () {
		catsAPIservice.create($scope.record).success(function (response) {
			alert('Record saved');
			if ($scope.createAnother === false){
				$modalInstance.close($scope.selected.sampleType);
			}
		//	$scope.alert = { type: 'success', msg: 'Record saved' };
		//	 $scope.alerts.push({ type: 'success', msg: 'Record saved' });
		});
	};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.sampleType);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
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