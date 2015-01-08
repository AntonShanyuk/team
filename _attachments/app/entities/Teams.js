define(['angular'], function (angular) {
    'use strict';

    angular.module('app').factory('Teams', ['CouchEntity', function (CouchEntity) {
        var entity = {
            type: 'team',
            props: ['name'],
            url: '_view/team'
        };

        return new CouchEntity(entity);
    }]);
});