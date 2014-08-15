app.factory('CouchDbResource', function ($resource, CouchDbAction) {

    function formatViewResponse(response) {
        var responseObject = JSON.parse(response);
        var values = _.chain(responseObject.rows).map(function (row) {
            return row.value;
        }).uniq(function (item) {
            return item._id;
        }).value();
        return { rows: values };
    }

    return function (entity) {
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
                            row.value[relation + 's'] = _.chain(responseObject.rows)
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
            post: new CouchDbAction({ method: 'POST', params: {}, url: '../..', entity: entity }),
            put: new CouchDbAction({ method: 'PUT', entity: entity }),
            'delete': { method: 'DELETE' },
            get: {
                method: 'GET',
                url: encodeURI('_view/' + entity.type + 'Relations' + '?key=":id"'),
                params: { v: function () { return new Date().getTime() } },
                transformResponse: formatGetResponse
            },
            getAll: {
                method: 'GET',
                url: encodeURI('_view/' + entity.type + 'Relations'),
                params: { v: function () { return new Date().getTime() } },
                transformResponse: formatViewRelationsResponse
            },
            query: {
                method: 'GET', params: { v: function () { return new Date().getTime() } }, isArray: false, url: encodeURI('_view/' + entity.type + '?startkey=":name"&endkey=":name\ufff0"'), transformResponse: function (response) {
                    return formatViewResponse(response);
                }
            }
        }
        return $resource(encodeURI('../../:id?rev=:rev'), null, methods);
    }
});