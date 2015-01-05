app.factory('Comments', function () {
    return new CouchEntity({
        type: 'comment',
        props: ['text', 'member', 'date'],
        url: '_view/comment'
    });
});