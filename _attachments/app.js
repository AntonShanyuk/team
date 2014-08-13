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

app.filter('reverse', function () {
    return function (items) {
        if (items) {
            return items.slice().reverse();
        }
    }
});

app.controller('homeCtrl', function ($scope, $location, $modal, Teams) {
    var emptyTeam = { name: '' };
    $scope.newTeam = angular.copy(emptyTeam);
    Teams.query().$promise.then(function (data) {
        $scope.teams = data.rows;
    });
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.addTeam = function () {
        Teams.post($scope.newTeam).$promise.then(function () {
            $scope.teams.push($scope.newTeam);
            $scope.newTeam = angular.copy(emptyTeam);
        });
    }

    $scope.isValid = function () {
        return $scope.newTeam.name && $scope.newTeam.name.match(/^\w+$/);
    }

    $scope.removeTeam = function (team, $event) {
        var dialog = $modal.open({
            templateUrl: './app/confirm/confirm.html',
            controller: 'confirmCtrl',
            resolve: {
                localization: function () {
                    return {
                        question: 'Are you sure you want to delete this team?',
                        ok: 'Yes, I\'m sure',
                        no: 'No, thanks'
                    };
                }
            },
            size: 'sm'
        });

        dialog.result.then(function () {
            Teams.delete({ id: team._id, rev: team._rev }).$promise.then(function () {
                var index = $scope.teams.indexOf(team);
                $scope.teams.splice(index, 1);
            });
        });

        $event.stopPropagation();
    }
});