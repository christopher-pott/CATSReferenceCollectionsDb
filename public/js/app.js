'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngRoute'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/browse', {
      templateUrl: 'partials/browse',
      controller: 'ModalDemoCtrl'
    }).
    when('/view', {
      templateUrl: 'partials/view',
      controller: 'ViewController'
    }).
    when('/search', {
        templateUrl: 'partials/search',
        controller: 'SearchController'
      }).
    otherwise({
      redirectTo: '/browse'
    });

  $locationProvider.html5Mode(true);
});
