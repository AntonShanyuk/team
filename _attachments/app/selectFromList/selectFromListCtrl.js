app.controller('selectFromListCtrl', function ($scope, $modalInstance, items) {
    $scope.items = items;

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.select = function (item) {
        $modalInstance.close(item);
    }
});