define(['angular', 'modals', 'tableCtrl', 'typeaheadCtrl', 'Teams', 'Members'], function () {
    'use strict';

    var app = angular.module('app');

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
        return function(items) {
            if (items) {
                return items.slice().reverse();
            }
        }
    });

    app.controller('homeCtrl',[ '$scope', '$rootScope', '$location', '$q', 'Modals', 'Teams', 'Members',
    function ($scope, $rootScope, $location, $q, Modals, Teams, Members) {
        var emptyTeam = { name: '' };
        $scope.newTeam = angular.copy(emptyTeam);

        function loadData(args) {
            return Teams.get().then(function (data) {
                $scope.teams = data;
                if (args && args.teamId) {
                    _.findWhere($scope.teams, { _id: args.teamId }).active = true;
                }
            });
        }

        loadData();

        $rootScope.$on('teamChanged', function (event, args) {
            loadData(args);
        });

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.addTeam = function () {
            Teams.post($scope.newTeam).then(function () {
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
            return Members.put(member).then(function () {
                loadData({ teamId: team._id });
                $rootScope.$broadcast('memberChanged', { memberId: member._id });
            });
        }

        $scope.removeTeam = function (team, $event) {
            Modals.remove('Are you sure you want to delete this team?').then(function () {
                var promises = [];

                for (var i = 0; i < team.members.length; i++) {
                    var member = team.members[i];
                    var promise = $scope.removeFromTeam(team, member);
                    promises.push(promise);
                }

                $q.all(promises).then(function () {
                    Teams.delete(team._id, team._rev).then(function () {
                        var index = _.indexOf($scope.teams, team);
                        $scope.teams.splice(index, 1);
                    });
                });
            });

            $event.stopPropagation();
        }
    }]);

    return app;
});