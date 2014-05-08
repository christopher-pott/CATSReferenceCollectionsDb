'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var serviceMod = angular.module('myApp.services', []).value('version', '0.1');

serviceMod.factory('catsAPIservice', function($http) {	
	return {
		search: function(term) {
			var url = "search?type=sample&partialterm=" + term;
			return $http.get(url);
		},
		create: function(postData) {
	    	return $http({
		             url: 'sample',
		             method: "POST",
		             data: postData,
		             headers: {'Content-Type': 'application/json'}
	         		});
		}
	};
});

serviceMod.factory("state",function(){
	'use strict';
	var state = {};
	
	return {
	  state: state,
	};
});