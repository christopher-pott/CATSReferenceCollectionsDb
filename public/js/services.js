'use strict';

/* Services */

var serviceMod = angular.module('myApp.services', []).value('version', '0.1');

serviceMod.factory('catsAPIservice', function($http) {
	return {
		search : function(term) {
			var url = "search?type=sample&partialterm=" + term;
			return $http.get(url);
		},
		createSample : function(postData) {
			return $http({
				url : 'sample',
				method : "POST",
				data : postData,
				headers : {
					'Content-Type' : 'application/json'
				}
			});
		},
		update : function(id, sampleData) {
			return $http({
				url : 'sample?id=' + id,
				method : "PUT",
				data : sampleData,
				headers : {
					'Content-Type' : 'application/json'
				}
			});
		},
		delete : function(id) {
			return $http({
				url : 'sample?id=' + id,
				method : "DELETE"
			});
		},
		createArtwork : function(postData) {
			return $http({
				url : 'artwork',
				method : "POST",
				data : postData,
				headers : {
					'Content-Type' : 'application/json'
				}
			});
		},
		readArtwork : function(id) {
			var url = "artwork?id=" + id;
			return $http.get(url);
		}
	};
});

serviceMod.factory("state", function() {
	'use strict';
	var state = {};

	return {
		state : state,
	};
});