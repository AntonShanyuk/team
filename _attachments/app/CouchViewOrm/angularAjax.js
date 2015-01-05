(function (angular) {
    var angularCouch = angular.module('angularCouch', []);
    angularCouch.run(run);

    run.$inject = ['$http'];
    function run($http) {
        window.angularAjax = {
            get: get,
            put: put,
            post: post,
            'delete': remove
        }

        function get(url) {
            return $http.get(url, { cache:false }).then(getResponseData);
        }

        function put(url, data) {
            return $http.put(url, data).then(getResponseData);
        }

        function post(url, data) {
            return $http.post(url, data).then(getResponseData);
        }

        function remove(url) {
            return $http.delete(url).then(getResponseData);
        }

        function getResponseData(response) {
            return response.data;
        }
    }
})(angular);