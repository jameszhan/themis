angular.module('local.resources', ['ngResource', 'ui.bootstrap.modal'])
    .factory('Task', function($resource) {
        return $resource('tasks/:id.json', {id: '@id'});
    });