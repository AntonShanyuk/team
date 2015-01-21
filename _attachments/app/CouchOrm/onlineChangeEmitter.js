define(['Q', 'underscore'], function(Q, _) {
    return function (db) {
        return {
            handleCollection: handleCollection
        }

        function handleCollection(entityConfig, factoryConfig) {
            var db = factoryConfig.db;
            var deffered = Q.defer();
            var url = urlFormat('{0}/_changes?feed=longpoll&include_docs=true&filter=_view&view={0}/{1}',
                factoryConfig.designDoc, entityConfig.type);

            db.get(url).then(function (response) {
                var collection = response.results.pluck('doc');
                deferred.resolve(collection);
                handleChangesRecoursive(collection, url, response, entityConfig, factoryConfig);
            }, deferred.reject);
            return deferred.promise;
        }

        function handleChangesRecoursive(collection, url, response, entityConfig, factoryConfig) {
            var ids = collection.pluck('id');
            var idsUrl = urlFormat('{0}/_changes?feed=longpoll&filter=_doc_ids',
                factoryConfig.designDoc, entityConfig.type);
            db.post(idsUrl, ids).then(function(response) {
                var deletedItems = response.where({ deleted: true });
                for (var i = 0; i < deletedItems.length; i++) {
                    var itemToDelete = _.findWhere(collection, { _id: deletedItems[i].id });
                    var index = _.indexOf(collection, itemToDelete);
                    collection.splice(index, 1);
                }
            });
            db.get(urlFormat('{0}&since={1}', url, response.last_seq)).then(function(updatedResponse) {
                var addedItems = 
                handleChangesRecoursive(collection, deferred, url, updatedResponse);
            }, deferred.reject);
        }

        function urlFormat(input) {
            var args = Array.prototype.slice.call(arguments, 1);
            var output = input.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
            return encodeURI(output);
        }
    }
});