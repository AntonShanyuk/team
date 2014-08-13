app.factory('Teams', function (CouchDbResource) {
    var entity = {
        type: 'team',
        props: ['name']
    }
    
    return new CouchDbResource(entity);
});