app.controller('tableCtrl', function ($scope, Modals, Members, Teams, Comments) {
    function loadData() {
        Members.getAll().$promise.then(function (data) {
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

    $scope.toggleComments = function (member) {
        member.commentsVisible = !member.commentsVisible;
    };

    $scope.addComment = function (member) {
        var comment = { text: member.comment, member: member._id, date: new Date() };
        Comments.post(comment).$promise.then(function () {
            if (!member.comments) {
                member.comments = [];
            }
            member.comments.push(comment);
            member.comment = '';
        });
    };

    $scope.deleteComment = function (member, comment) {
        Comments.delete({ id: comment._id, rev: comment._rev }).$promise.then(function () {
            var index = _.indexOf(member.comments, comment);
            member.comments.splice(index, 1);
        });
    };
});