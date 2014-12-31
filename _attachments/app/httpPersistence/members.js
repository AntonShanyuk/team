app.factory('Members', function (CouchDbEntity) {
    function stringFormat(input) {
        var args = Array.prototype.slice.call(arguments, 1);
        return input.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };

    return new CouchDbEntity({
        type: 'member',
        props: ['name', 'teams'],
        url: '_view/member',
        indexes: {
            byName: function(name) {
                return stringFormat('_view/memberByName?startkey="{0}"&endkey="{0}\ufff0"', name);
            }
        }
    });
});