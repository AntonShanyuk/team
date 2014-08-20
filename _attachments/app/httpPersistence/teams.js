app.factory('Teams', function (CouchDbResource) {
    var entity = {
        type: 'team',
        props: ['name'],
        url: '_view/team'
    };
    
    return new CouchDbResource(entity);
});