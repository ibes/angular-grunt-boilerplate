'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ui.router'
]).
config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/state1');
  //
  // Now set up the states
  $stateProvider
    .state('state1', {
      url: '/state1',
      templateUrl: 'modules/state1/views/index.html'
    })
    .state('state2', {
      url: '/state2',
      templateUrl: 'modules/state2/views/index.html'
    });
});