app.factory('CouchDbAction', function () {
    return function(extend) {
        this.method = 'GET';
        this.params = { id: "@_id", rev: "@_rev" };

        var originalObject;
        this.transformRequest = function (object) {
            originalObject = object;
            var model = {};
            var props = extend.entity.props;
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                var value = object[prop];
                if (value) {
                    model[prop] = value;
                }
            }
            model.type = extend.entity.type;
            return JSON.stringify(model)
        };
        this.transformResponse = function (response) {
            var responseObject = JSON.parse(response);
            originalObject._id = responseObject.id;
            originalObject._rev = responseObject.rev;
        };
        angular.extend(this, extend);
    }
})