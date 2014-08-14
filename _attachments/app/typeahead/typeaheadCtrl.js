app.controller('typeaheadCtrl', function ($scope, $timeout, $modal, $q, Members, Teams) {
    $scope.selectedMembers = [];
    $scope.foundMembers = [];
    $scope.input = '';

    function loadMembers() {
        if ($scope.input) {
            Members.query({ name: $scope.input }).$promise.then(function (data) {
                $scope.foundMembers = data.rows;
                var previous = null;
                _.chain($scope.foundMembers)
                .each(function (member) {
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
            $scope.selectMember($scope.active);
        } else {
            Members.post({ name: $scope.input }).$promise.then(function () {
                loadMembers();
            });
        }
    }

    $scope.selectMember = function (member) {
        if (_.indexOf($scope.selectedMembers, member) < 0) {
            $scope.selectedMembers.push(member);
        }
    }

    $scope.unSelectMember = function (member) {
        var index = _.indexOf($scope.selectedMembers, member);
        $scope.selectedMembers.splice(index, 1);
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

    $scope.addToTeam = function () {
        Teams.query().$promise.then(function (data) {
            var dialog = $modal.open({
                templateUrl: './app/selectFromList/selectFromList.html',
                controller: 'selectFromListCtrl',
                resolve: {
                    items: function () {
                        return data.rows;
                    }
                }
            });
            dialog.result.then(function (team) {
                var promises = [];
                for (var i = 0; i < $scope.selectedMembers.length; i++) {
                    var member = $scope.selectedMembers[i];
                    if (!member.teams) {
                        member.teams = [];
                    }
                    if (!_.contains(member.teams, team._id)) {
                        member.teams.push(team._id);
                        var promise = Members.put(member).$promise;
                        promises.push(promise);
                    }
                }
                $q.all(promises).then(function () {
                    $scope.$emit('teamChanged', { teamId: team._id });
                    $scope.selectedMembers = [];
                });
            });
        });

    }
});