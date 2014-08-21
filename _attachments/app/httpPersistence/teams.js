app.factory('Teams', function (CouchDbEntity) {
    var entity = {
        type: 'team',
        props: ['name'],
        url: '_view/team'
    };
    
    return new CouchDbEntity(entity);
});