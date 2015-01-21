define([], function() {
    requirejs.config({
        paths: {
            jquery: 'libs/js/jquery-1.11.1.min',
            domReady: 'libs/js/domReady',
            underscore: 'libs/js/underscore-min',
            Q: 'libs/js/q',
            bootstrap: 'libs/js/bootstrap.min',
            angular: 'libs/js/angular',
            'angular-route': 'libs/js/angular-route.min',
            'angular-resource': 'libs/js/angular-resource.min',
            'angular-ui': 'libs/js/ui-bootstrap-tpls-0.11.0.min',
            CouchEntityFactory: 'app/CouchOrm/CouchEntityFactory',
            CouchEntity: 'app/CouchOrm/CouchEntity',
            modals: 'app/commonServices/modals',
            tableCtrl: 'app/table/tableCtrl',
            typeaheadCtrl: 'app/typeahead/typeaheadCtrl',
            confirmCtrl: 'app/confirm/confirmCtrl',
            selectFromListCtrl: 'app/selectFromList/selectFromListCtrl',
            Teams: 'app/entities/Teams',
            Members: 'app/entities/Members',
            Comments: 'app/entities/Comments'
        },
        shim: {
            angular: {
                exports: 'angular'
            },
            'angular-route': {
                deps: ['angular']
            },
            'angular-resource': {
                deps: ['angular']
            },
            'angular-ui': {
                deps: ['angular', 'bootstrap']
            },
            underscore: {
                exports: '_'
            },
            bootstrap: ['jquery']
        }
    });
    require(['angular', 'angular-route', 'angular-resource', 'angular-ui', 'CouchEntity'], function (angular) {
        angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap', 'angularCouch']);
        require(['domReady!', 'app'], function (document) {
            angular.bootstrap(document.body, ['app']);
        });
    });
});