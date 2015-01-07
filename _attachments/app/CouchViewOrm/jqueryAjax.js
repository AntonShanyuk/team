(function ($) {
    "use strict";

    window.jqueryAjax = {
        get: get,
        put: put,
        post: post,
        'delete': remove
    }

    function get(url) {
        return $.ajax(url, { dataType: 'json', type: 'GET' });
    }

    function put(url, data) {
        return $.ajax(url, { data: JSON.stringify(data), dataType: 'json', contentType: 'application/json', type: 'PUT' });
    }

    function post(url, data) {
        return $.ajax(url, { data: JSON.stringify(data), dataType: 'json', contentType: 'application/json', type: 'POST' });
    }

    function remove(url) {
        return $.ajax(url, { dataType: 'json', type: 'DELETE' });
    }
})($);