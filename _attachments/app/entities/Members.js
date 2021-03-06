﻿define(['angular'], function (angular) {
    'use strict';

    angular.module('app').factory('Members', ['CouchEntity', function (CouchEntity) {
        function stringFormat(input) {
            var args = Array.prototype.slice.call(arguments, 1);
            return input.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
                ;
            });
        };

        return new CouchEntity({
            type: 'member',
            props: ['name', 'teams'],
            indexes: {
                byName: function (name) {
                    return stringFormat('_view/memberByName?startkey="{0}"&endkey="{0}\ufff0"', name);
                }
            }
        });
    }]);
});