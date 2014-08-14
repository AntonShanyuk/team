app.controller('typeaheadCtrl', function ($scope, $timeout, $modal, Members, Teams) {
    $scope.foundMembers = [];
    $scope.input = '';

    function loadMembers() {
        if ($scope.input) {
            Members.query({ name: $scope.input }).$promise.then(function (data) {
                $scope.foundMembers = data.rows;
                var previous = null;
                _.each($scope.foundMembers, function (member) {
                    member.previous = previous;
                    if (previous) {
                        previous.next = member;
                    }
                    previous = member;
                });
                $scope.active = $scope.foundMembers[0];
            });
        } else {
            $scope.foundMembers = [];
        }
    }

    $scope.keyup = function (event) {
        switch (event.keyCode) {
            case 40: // down
                var next = $scope.active.next;
                if (!next) {
                    next = $scope.foundMembers[0];
                }
                $scope.active = next;
                break;
            case 38: // up
                var previous = $scope.active.previous;
                if (!previous) {
                    previous = $scope.foundMembers[$scope.foundMembers.length - 1];
                }
                $scope.active = previous;
                break;
            default:
                break;
        }
    };

    $scope.submit = function () {
        if ($scope.foundMembers.length) {
            $scope.addToTeam($scope.active);
        } else {
            Members.post({ name: $scope.input }).$promise.then(function () {
                loadMembers();
            });
        }
    }

    $scope.change = function () {
        if ($scope.timeout) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout(function () {
            loadMembers();
        }, 200);
    };

    $scope.setActive = function (member) {
        $scope.active = member;
    }

    $scope.addToTeam = function (member) {
        Teams.query().$promise.then(function (data) {
            var dialog = $modal.open({
                templateUrl: './app/selectFromList/selectFromList.html',
                controller: 'selectFromListCtrl',
                resolve: {
                    items: function () {
                        if (member.teams && member.teams.length) {
                            return _.each(data.rows, function (team) {
                                team.active = _.contains(member.teams, team._id);
                            });
                        }
                        else return data.rows;
                    }
                }
            });
            dialog.result.then(function (activeItems) {
                var ids = _.pluck(activeItems, '_id');
                member.teams = ids;
                Members.put(member).$promise.then(function () {
                    $scope.$emit('teamsChanged')
                });
            });
        });
        
    }
});