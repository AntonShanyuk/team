app.factory('CouchDbResource', function ($resource, CouchDbAction) {
    return function (entity) {
        var methods = {
            post: new CouchDbAction({ method: 'POST', params: {}, url: '../..', entity: entity }),
            put: new CouchDbAction({ method: 'PUT', entity: entity }),
            'delete': { method: 'DELETE' },
            get: { method: 'GET', url: encodeURI('../../:id'), params: { v: function () { return new Date().getTime() } } },
            query: {
                method: 'GET', params: { v: function () { return new Date().getTime() } }, isArray: false, url: encodeURI('_view/' + entity.type + '?startkey=":name"&endkey=":name\ufff0"'), transformResponse: function (response) {
                    var responseObject = JSON.parse(response);
                    var values = _.chain(responseObject.rows).map(function (row) {
                        return row.value;
                    }).uniq(function (item) {
                        return item._id;
                    }).value();

                    return { rows: values };
                }
            }
        }
        return $resource(encodeURI('../../:id?rev=:rev'), null, methods);
    }
});