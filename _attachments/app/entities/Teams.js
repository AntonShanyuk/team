app.factory('Teams', function (CouchEntity) {
    var entity = {
        type: 'team',
        props: ['name'],
        url: '_view/team'
    };
    
    return new CouchEntity(entity);
});