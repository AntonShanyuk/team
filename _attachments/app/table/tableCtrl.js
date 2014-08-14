app.controller('tableCtrl', function ($scope, Modals, Members, Teams) {
    function loadData() {
        Members.query().$promise.then(function (data) {
            $scope.members = data.rows;
        })
    }
    $scope.$on('$viewContentLoaded', loadData);
    $scope.removeMember = function (member) {
        Modals.remove('Are you sure you want to delete this member?').then(function () {
            Members.delete({ id: member._id, rev: member._rev }).$promise.then(function () {
                var index = _.indexOf($scope.members, member);
                $scope.members.splice(index, 1);
                $scope.$emit('teamChanged');
            });
        });
    };

    $scope.addToTeam = function (member) {
        Modals.addToTeam([member]).then(function (team) {
            $scope.$emit('teamChanged', { teamId: team._id });
        });
    };
});