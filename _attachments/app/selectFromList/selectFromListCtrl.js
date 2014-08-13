app.controller('selectFromListCtrl', function ($scope, $modalInstance, items) {
    $scope.items = items;

    $scope.ok = function () {
        var activeItems = _.where($scope.items, { active: true });
        $modalInstance.close(activeItems);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.toggleActive = function (item) {
        item.active = !item.active;
    };
});