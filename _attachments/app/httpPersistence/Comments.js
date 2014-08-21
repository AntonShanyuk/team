app.factory('Comments', function (CouchDbEntity) {
    return new CouchDbEntity({
        type: 'comment',
        props: ['text', 'member', 'date'],
        url: '_view/comment'
    });
});