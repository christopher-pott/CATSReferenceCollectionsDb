'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
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
controller('RegisterController', function ($scope, catsAPIservice) {
	$scope.sampleTypes = [{id: 'fibre', name: 'Fibre(paper)'},
	                      {id: 'paint', name: 'Paint'},
	                      {id: 'material', name: 'Material'},
	                      {id: 'pigment', name: 'Pigment'},
	                      {id: 'stretcher', name: 'Stretcher'},
	                      {id: 'xray', name: 'Xray'},
	                      {id: 'photograph', name: 'photograph'},
	                      {id: 'infrared', name: 'infrared'}];

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

	$scope.register = function() {
		catsAPIservice.create($scope.record).success(function (response) {
			alert('Record saved');
		});
	};
}).
controller('SearchController', function ($scope, catsAPIservice) {

	$scope.searchResultsList = [];

	$scope.search = function() {
		catsAPIservice.search($scope.searchTerm).success(function (response) {
			$scope.searchResultsList = response;
			//	alert("found : " + $scope.searchResultsList);
		});
	};
});