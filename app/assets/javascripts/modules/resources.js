angular.module('local.resources', ['ngResource', 'ui.bootstrap.modal'])
    .config(function($httpProvider){
        $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $("meta[name='csrf-token']").attr("content");
    })
    .factory('Task', function($resource) {
        return $resource('api/v1/tasks/:id', {id: '@id'}, {update: {method: 'PATCH'}});
    })
    .factory('Timesheet', function($resource) {
        return $resource('api/v1/timesheets/:id', {id: '@id'}, {update: {method: 'PATCH'}});
    });