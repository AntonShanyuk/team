app.factory('Comments', ['CouchEntity', function (CouchEntity) {
    return new CouchEntity({
        type: 'comment',
        props: ['text', 'member', 'date'],
        url: '_view/comment'
    });
}]);