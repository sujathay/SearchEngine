'use strict';

var SearchEngineApp = angular.module('SearchEngineApp', ['ui.directives', 'ui.filters']);
SearchEngineApp.config(function($routeProvider) {
    $routeProvider.when(
    	'/Search', 
    	{
    		templateUrl: 'partials/Search.html', 
    		controller: 'SearchController'
    	}); 
    $routeProvider.otherwise(
        {
            redirectTo: '/Search'
        });
});
