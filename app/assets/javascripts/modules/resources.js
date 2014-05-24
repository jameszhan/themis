angular.module('local.resources', ['ngResource', 'ui.bootstrap.modal'])
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $("meta[name='csrf-token']").attr("content");
    }])
    .factory('Config', function($resource){
        var prefix = 'api/v1/config';
        return $resource(prefix, {}, {
            categories: {method: 'GET', url: prefix + '/categories', isArray: true}
        });
    })
    .factory('Task', function($resource) {
        return $resource('api/v1/tasks/:id', {id: '@id'}, {update: {method: 'PATCH'}});
    })
    .factory('Timesheet', function($resource) {
        return $resource('api/v1/timesheets/:id', {id: '@id'}, {update: {method: 'PATCH'}});
    });