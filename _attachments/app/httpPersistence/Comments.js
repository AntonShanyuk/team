app.factory('Comments', function (CouchDbResource) {
    return new CouchDbResource({
        type: 'comment',
        props: ['text', 'member', 'date'],
        url: '_view/comment'
    });
});