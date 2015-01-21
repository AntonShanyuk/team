define(['angular'], function (angular) {
    'use strict';

    angular.module('app').factory('Comments', ['CouchEntity', function (CouchEntity) {
        return new CouchEntity({
            type: 'comment',
            props: ['text', 'member', 'date']
        });
    }]);
});