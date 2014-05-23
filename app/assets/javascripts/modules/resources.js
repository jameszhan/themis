angular.module('local.resources', ['ngResource', 'ui.bootstrap.modal'])
    .config(function($httpProvider){
        var csrfToken = $("meta[name='csrf-token']").attr("content");
        $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    })
    .factory('Task', function($resource) {
        return $resource('tasks/:id.json', {id: '@id'});
    });