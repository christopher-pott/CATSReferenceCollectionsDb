'use strict';

/* Services */

var serviceMod = angular.module('myApp.services', []).value('version', '0.1');

serviceMod.factory('catsAPIservice', function($http) {
	return {
		search : function(term) {
			var url = "newSearch?type=sample&pageSize=100&partialterm=" + term;
			return $http.get(url);
		},
        searchSize : function(term) {
            var url = "newSearchSize?type=sample&partialterm=" + term;
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
		},
        Excel : function(term) {
            return $http({
                url : "Excel?partialterm=" + term,
                method : "GET",
                responseType: 'arraybuffer' /*important!*/
            });
        },
        login : function(email, password) {
            return $http({
                url : '/login?username=' + email + '&password=' + password,
                method : "POST",
            });
        },
        logout : function() {
            return $http({
                url : '/logout',
                method : "POST",
            });
        },        
		loggedin : function() {
			var url = "/loggedin";
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