﻿app.factory('CouchDbEntity', function ($resource, CouchDbAction) {

    function stringFormat(input) {
        var args = Array.prototype.slice.call(arguments, 1);
        return input.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };

    function formatViewResponse(response) {
        var responseObject = JSON.parse(response);
        var values = _.chain(responseObject.rows).map(function (row) {
            return row.value;
        }).uniq(function (item) {
            return item._id;
        }).value();
        return { rows: values };
    }

    var ctor = function (entity) {

        entity.config = entity.config || {};
        angular.extend(entity.config, ctor.config);

        function formatViewRelationsResponse(response) {
            var responseObject = JSON.parse(response);
            var relations = _.chain(responseObject.rows).
                pluck('value').
                pluck('type').
                uniq().
                reject(function (value) {
                    return value == entity.type;
                }).value();
            if (relations) {
                var rows = _.chain(responseObject.rows)
                    .filter(function (row) {
                        return row.value.type == entity.type;
                    })
                    .each(function (row) {
                        for (var i in relations) {
                            var relation = relations[i];
                            var relationProp = ctor.relationMappings[relation] || relation + 's';
                            row.value[relationProp] = _.chain(responseObject.rows)
                                .filter(function (relationRow) {
                                    return relationRow.value.type == relation && relationRow.key == row.key;
                                }).pluck('value').value();
                        }
                    })
                    .pluck('value')
                    .value();
                return { rows: rows };
            } else {
                return responseObject;
            }
        }

        function formatGetResponse(response) {
            var viewRelationsResponse = formatViewRelationsResponse(response);
            return viewRelationsResponse.rows[0];
        }

        var methods = {
            post: new CouchDbAction({ method: 'POST', params: {}, url: entity.config.dbUrl, entity: entity }),
            put: new CouchDbAction({ method: 'PUT', entity: entity }),
            'delete': { method: 'DELETE' },
            get: {
                method: 'GET',
                url: encodeURI(stringFormat('{0}?key=":id"', entity.url)),
                params: { v: function () { return new Date().getTime() } },
                transformResponse: formatGetResponse
            },
            getAll: {
                method: 'GET',
                url: encodeURI(entity.url),
                params: { v: function () { return new Date().getTime() } },
                transformResponse: formatViewRelationsResponse
            }
        }

        entity.indexes = entity.indexes || [];
        for (var i = 0; i < entity.indexes.length; i++) {
            var index = entity.indexes[i];
            var methodName = 'query$' + index.keys.sort().toString();
            methods[methodName] = {
                method: 'GET', params: { v: function () { return new Date().getTime() } }, isArray: false, url: encodeURI(index.url), transformResponse: function (response) {
                    return formatViewResponse(response);
                }
            }
        }

        var resource = $resource(encodeURI(stringFormat('{0}/:id?rev=:rev', entity.config.dbUrl)), null, methods);
        var get = resource.get;
        resource.get = function (id) {
            if (id) {
                return get.call(resource, { id: id });
            } else {
                return resource.getAll();
            }
        };

        resource.query = function (params) {
            var indexKey = _.keys(params).sort();
            var methodName = 'query$' + indexKey.toString();
            if (!resource[methodName]) {
                throw new Error("Failed to find the view for specified parameters: " + indexKey);
            }

            return resource[methodName](params);
        };
        return resource;
    };

    ctor.config = {
        dbUrl: '../..'
    };

    ctor.relationMappings = {};

    return ctor;
});