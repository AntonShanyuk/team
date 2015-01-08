define(['angular'], function(angular) {
    'use strict';

    angular.module('app').controller('confirmCtrl', function ($scope, $modalInstance, localization) {
        $scope.localization = localization;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
});