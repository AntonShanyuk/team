app.factory('Modals', function ($modal, $q, Teams, Members) {

    return {
        remove: function (heading) {
            var dialog = $modal.open({
                templateUrl: './app/confirm/confirm.html',
                controller: 'confirmCtrl',
                resolve: {
                    localization: function () {
                        return {
                            question: heading,
                            ok: 'Yes, I\'m sure',
                            no: 'No, thanks'
                        };
                    }
                },
                size: 'sm'
            });
            return dialog.result;
        },
        addToTeam: function (members) {
            var deferred = $q.defer();

            Teams.query().$promise.then(function (data) {
                var dialog = $modal.open({
                    templateUrl: './app/selectFromList/selectFromList.html',
                    controller: 'selectFromListCtrl',
                    resolve: {
                        items: function () {
                            return data.rows;
                        }
                    }
                }, deferred.reject);
                dialog.result.then(function (team) {
                    var promises = [];
                    for (var i = 0; i < members.length; i++) {
                        var member = members[i];
                        if (!member.teams) {
                            member.teams = [];
                        }
                        if (!_.contains(member.teams, team._id)) {
                            member.teams.push(team._id);
                            var promise = Members.put(member).$promise;
                            promises.push(promise);
                        }
                    }
                    $q.all(promises).then(function () {
                        deferred.resolve(team);
                    }, deferred.reject);
                });
            });

            return deferred.promise;
        }

    }
});