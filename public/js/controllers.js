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

	$scope.lists.layerTypes = [{id: '1', name: 'Ground'},
	  	                      {id: '2', name: 'Imprimatura'},
	  	                      {id: '3', name: 'Varnish'},
	  	                      {id: '4', name: 'Paint'}];

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
	  	                      {id: '6', name: 'Other'}];	

	$scope.lists.glueTypes = [{id: '1', name: 'Animal'},
	  	                      {id: '2', name: 'Synthetic'},
	  	                      {id: '3', name: 'Vegetable'}];	

	$scope.lists.groundTypes = [{id: 'onelayer', name: '1-layer'},
	                      {id: 'twolayer', name: '2-layer'},
	                      {id: 'colour', name: 'Colour'}];

	$scope.lists.artworks = [{id: '1', name: 'KMS8050'},
	  	                      {id: '2', name: 'KKShm2345 verso'},
	  	                      {id: '3', name: 'DEP620'}];

	$scope.lists.catsbinders = [{id: '1', name: 'Casin', dkname: 'kasein', grp:'Others'},
	  	                      {id: '2', name: 'Emulsion', dkname: 'emulsion', grp:'Others'},
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
	
	$scope.lists.colours =
		[{id: '1', name: 'white', namedk:'(hvid)', type:'Other', ticked:'false'},
	    {id: '2', name: 'black', namedk:'(sort)', type:'Other', ticked:'false'},
	    {id: '3', name: 'green', namedk:'(grøn)', type:'RGB', ticked:'false'},
	    {id: '4', name: 'blue', namedk:'(blå)', type:'RGB', ticked:'false'},
	    {id: '5', name: 'red', namedk:'(rød)', type:'RGB', ticked:'false'},
	    {id: '6', name: 'cyan', namedk:'(cyan)', type:'CMY', ticked:'false'},
	    {id: '7', name: 'magenta', namedk:'(magenta)', type:'CMY', ticked:'false'},
	    {id: '8', name: 'yellow', namedk:'(gul)', type:'CMY', ticked:'false'},
	    {id: '9', name: '', namedk:'(blågrøn)', type:'Other', ticked:'false'}];


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
			catslayer:[{id: "1", layerType: "", groundType:"", catsbinder: [], colour: "", pigment: "", dye: "", active: true}],
			catsanalysis:[{id: "1", catsanalysisType: "", catsanalysisDescription:"", active: true}],
			relatedartworks:[{id: "1", refnumber: "",  title: "Title", artist: "", technique: "", dimensions: "", productiondate: "", owner: "", active: true}]
	};
	
	$scope.sampleTypes = lists.sampleTypes;
	$scope.groundTypes = lists.groundTypes;
	$scope.colours = lists.colours;
	$scope.layerTypes = lists.layerTypes;
	$scope.catsbinders = lists.catsbinders;
	$scope.test = lists.test;
	$scope.analysisTypes = lists.analysisTypes;
	$scope.artworks = lists.artworks;

		
	/*START tabs for paint layers*/
    var setAllInactive = function() {
        angular.forEach($scope.record.catslayer, function(catslayer) {
            catslayer.active = false;
        });
    };
	
    var addNewLayer = function() {
    	var id = $scope.record.catslayer.length + 1;
        $scope.record.catslayer.push({id: id, layerType: "", groundType:"", catsbinder: [], colour: "", pigment: "", dye: "",  active: true});
    };

    $scope.addLayer = function () {
        setAllInactive();
        addNewLayer();
    };
   
    $scope.removeLayerTab = function (index) {
        $scope.record.catslayer.splice(index, 1);
    };
    /*END tabs for paint layers*/
    
	/*START tabs for analysis*/
    var setAllAnalysisInactive = function() {
        angular.forEach($scope.record.catsanalysis, function(catsanalysis) {
        	catsanalysis.active = false;
        });
    };
	
    var addNewAnalysis = function() {
    	var id = $scope.record.catsanalysis.length + 1;
        $scope.record.catsanalysis.push({id: id, catsanalysisType: "", catsanalysisDescription:"", active: true});
    };

    $scope.addAnalysis = function () {
        setAllAnalysisInactive();
        addNewAnalysis();
    };
    
    $scope.removeAnalysisTab = function (index) {
        $scope.record.catsanalysis.splice(index, 1);
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