app.factory('Members', function (CouchDbEntity) {
    return new CouchDbEntity({
        type: 'member',
        props: ['name', 'teams'],
        url: '_view/member',
        indexes: [
            { keys: ['name'], url: '_view/memberByName?startkey=":name"&endkey=":name\ufff0"' }
        ]
    });
});