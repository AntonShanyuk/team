app.factory('Members', function (CouchDbResource) {
    return new CouchDbResource({
        type: 'member',
        props: ['name', 'teams']
    });
});