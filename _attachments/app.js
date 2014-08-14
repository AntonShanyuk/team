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

app.controller('homeCtrl', function ($scope, $rootScope, $location, $modal, $q, Teams, Members) {
    var emptyTeam = { name: '' };
    $scope.newTeam = angular.copy(emptyTeam);

    function loadData(teamId) {
        Teams.getAll().$promise.then(function (data) {
            $scope.teams = data.rows;
            if (teamId) {
                _.findWhere($scope.teams, { _id: teamId }).active = true;
            }
        });
    }

    loadData();

    $rootScope.$on('teamChanged', function (event, args) {
        loadData(args.teamId);
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

    $scope.removeFromTeam = function (team, member) {
        var index = _.indexOf(member.teams, team._id);
        member.teams.splice(index, 1);
        return Members.put(member).$promise.then(function () {
            var index = _.indexOf(team.members, member);
            team.members.splice(index, 1);
        });
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

            var promises = [];
            for (var i = 0; i < team.members.length; i++) {
                var member = team.members[i];
                var promise = $scope.removeFromTeam(team, member);
                promises.push(promise);
            }

            $q.all(promises).then(function () {
                Teams.delete({ id: team._id, rev: team._rev }).$promise.then(function () {
                    var index = _.indexOf($scope.teams, team);
                    $scope.teams.splice(index, 1);
                });
            });
        });

        $event.stopPropagation();
    }
});