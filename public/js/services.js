'use strict';

/* Services */

var serviceMod = angular.module('myApp.services', []).value('version', '0.1');

serviceMod.factory('catsAPIservice', function($http) {
	return {
		search : function(term, filter) {
			var url = "search?type=sample&pageSize=100" 
			        + ((!!term) ? "&fulltext=" + term : "");
			if (filter && filter.isOpen){
			    url +=((!!filter.sampleType) ? "&sampletype=" + filter.sampleType.name : "") 
                    + ((!!filter.earliestDate) ? "&startdate=" + filter.earliestDate : "") 
                    + ((!!filter.latestDate) ? "&enddate=" + filter.latestDate : "");
			}
			return $http.get(url);
		},
        searchSize : function(term, filter) {
            var url = "searchSize?type=sample" 
                    + ((!!term) ? "&fulltext=" + term : "");
            if (filter && filter.isOpen){
                url +=((!!filter.sampleType) ? "&sampletype=" + filter.sampleType.name : "") 
                    + ((!!filter.earliestDate) ? "&startdate=" + filter.earliestDate : "") 
                    + ((!!filter.latestDate) ? "&enddate=" + filter.latestDate : "");
            }
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
        Excel : function(term, filter) {
            var url = "Excel?fulltext=" 
                    + ((!!term) ? "&fulltext=" + term : "");
            if (filter && filter.isOpen){
                url +=((!!filter.sampleType) ? "&sampletype=" + filter.sampleType.name : "") 
                    + ((!!filter.earliestDate) ? "&startdate=" + filter.earliestDate : "") 
                    + ((!!filter.latestDate) ? "&enddate=" + filter.latestDate : "");
            }
            return $http({
                url : url,
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
		},
	    updateUser : function(postData) {
	            return $http({
	                url : 'user',
	                method : "POST",
	                data : postData,
	                headers : {
	                    'Content-Type' : 'application/json'
	                }
	            });
	        },
	};
});

serviceMod.factory("state", function() {
	'use strict';
	var state = {};

	return {
		state : state,
	};
});