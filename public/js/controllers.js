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

//		$scope.$broadcast('searchRefresh');
	};

}).
controller('SearchController', function ($scope, catsAPIservice, state, $modal, $log) {
	/*used in modal*/
	$scope.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)'},
	                      {id: 'paint', name: 'Paint'},
	                      {id: 'material', name: 'Material'},
	                      {id: 'pigment', name: 'Pigment'},
	                      {id: 'stretcher', name: 'Stretcher'},
	                      {id: 'xray', name: 'Xray'},
	                      {id: 'photograph', name: 'photograph'},
	                      {id: 'infrared', name: 'infrared'}];
	
	$scope.searchResultsList = state.resultList;
	$scope.searchTerm = state.searchTerm;

	$scope.search = function() {
		catsAPIservice.search(state.searchTerm).success(function (response) {
			$scope.searchResultsList = response;
			state.resultList = response;
//			state.searchTerm = $scope.searchTerm;
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
    
    /*open create new record modal*/
	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl: 'myModalContent',
			controller: ModalInstanceCtrl,
			size: size,
			resolve:{
				sampleTypes: function () {
					return $scope.sampleTypes;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};


}).
controller('BrowseController', function ($scope) {
	// write Ctrl here

}).
controller('ViewController', function ($scope, state, catsAPIservice) {
	$scope.alerts = [];

	$scope.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)'},
	                      {id: 'paint', name: 'Paint'},
	                      {id: 'material', name: 'Material'},
	                      {id: 'pigment', name: 'Pigment'},
	                      {id: 'stretcher', name: 'Stretcher'},
	                      {id: 'xray', name: 'Xray'},
	                      {id: 'photograph', name: 'photograph'},
	                      {id: 'infrared', name: 'infrared'}];
	
	$scope.groundTypes = [{id: 'onelayer', name: '1-layer'},
	                      {id: 'twolayer', name: '2-layer'},
	                      {id: 'colour', name: 'colour'}];	

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
});

var ModalDemoCtrl = function ($scope, $modal, $log) {

	$scope.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)'},
	                      {id: 'paint', name: 'Paint'},
	                      {id: 'material', name: 'Material'},
	                      {id: 'pigment', name: 'Pigment'},
	                      {id: 'stretcher', name: 'Stretcher'},
	                      {id: 'xray', name: 'Xray'},
	                      {id: 'photograph', name: 'photograph'},
	                      {id: 'infrared', name: 'infrared'}];

	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl: 'myModalContent',
			controller: ModalInstanceCtrl,
			size: size,
			resolve:{
				sampleTypes: function () {
					return $scope.sampleTypes;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
};

	// Please note that $modalInstance represents a modal window (instance) dependency.
	// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, sampleTypes, catsAPIservice) {

	$scope.createAnother = false;
	
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
	
	$scope.sampleTypes = sampleTypes;
	
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