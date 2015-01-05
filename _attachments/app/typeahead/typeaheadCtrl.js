app.controller('typeaheadCtrl', function ($scope, $timeout, Modals, Members, Teams) {
    $scope.selectedMembers = [];
    $scope.foundMembers = [];
    $scope.input = '';

    function loadMembers() {
        if ($scope.input) {
            Members.byName($scope.input).then(function (data) {
                $timeout(function() {
                    $scope.foundMembers = data;
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
            });
        } else {
            $scope.foundMembers = [];
        }
    }

    $scope.$on('memberChanged', function (event, args) {
        var member = _.findWhere($scope.foundMembers, { _id: args.memberId });
        if (member) {
            Members.get(member._id).then(function (updatedMember) {
                for (var i in updatedMember) {
                    member[i] = updatedMember[i];
                }
            });
        }
    });

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
            Members.post({ name: $scope.input }).then(function () {
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
        Modals.addToTeam($scope.selectedMembers).then(function (team) {
            $scope.$emit('teamChanged', { teamId: team._id });
            $scope.selectedMembers = [];
        });
    }
});