'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ui.bootstrap']).
controller('AppCtrl', function ($scope, $http) {

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

}).
controller('BrowseController', function ($scope) {
	// write Ctrl here

}).
controller('RegisterController', function ($scope, state, catsAPIservice) {
	$scope.alerts = [];
	
	$scope.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)'},
	                      {id: 'paint', name: 'Paint'},
	                      {id: 'material', name: 'Material'},
	                      {id: 'pigment', name: 'Pigment'},
	                      {id: 'stretcher', name: 'Stretcher'},
	                      {id: 'xray', name: 'Xray'},
	                      {id: 'photograph', name: 'photograph'},
	                      {id: 'infrared', name: 'infrared'}];

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
controller('SearchController', function ($scope, catsAPIservice, state) {

	$scope.searchResultsList = state.resultList;
	$scope.searchTerm = state.searchTerm;

	$scope.search = function() {
		catsAPIservice.search($scope.searchTerm).success(function (response) {
			$scope.searchResultsList = response;
			state.resultList = response;
			state.searchTerm = $scope.searchTerm;
		});
	};
	$scope.viewSample = function(sample) {
		//alert('sample : ' + refNum);
		state.sample = sample;
		state.create = false;
	};
});