window.app = angular.module('team', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/table', {
        controller: 'tableCtrl',
        templateUrl: './app/table/table.html'
    }).when('/typeahead', {
        controller: 'typeaheadCtrl',
        templateUrl: './app/typeahead/typeahead.html'
    }).otherwise({
        redirectTo: '/typeahead'
    });
}]);

app.controller('homeCtrl', function ($scope, $location) {
    $scope.teams = [
        { name: 'team1', members: ['1', '2', '3', '4'] },
        { name: 'team2', members: ['5', '6', '7', '8'] },
        { name: 'team3', members: ['9', '10', '11', '12'] },
        { name: 'team4', members: ['13', '14', '15', '16'] },
        { name: 'team5', members: ['17', '18', '19', '20'] },
        { name: 'team6', members: ['21', '22', '23', '24'] },
    ];
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});