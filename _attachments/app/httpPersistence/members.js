app.factory('Members', function (CouchDbResource) {
    return new CouchDbResource({
        type: 'member',
        props: ['name', 'teams'],
        url: '_view/member',
        indexes: [
            { keys: ['name'], url: '_view/memberByName?startkey=":name"&endkey=":name\ufff0"' }
        ]
    });
});