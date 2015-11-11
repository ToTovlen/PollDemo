/**
 * Created by vlen on 2015/10/26.
 */
angular.module('polls', ['ngRoute','pollServices']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
           when('/polls', { templateUrl: 'partials/list.html', controller:'PollListCtrl' }).
            when('/poll/:pollId', { templateUrl: 'partials/item.html', controller: PollItemCtrl }).
            when('/new', { templateUrl: 'partials/new.html', controller: PollNewCtrl }).
            // If invalid route, just redirect to the main list view
           otherwise({ redirectTo: '/polls' });
    }]);