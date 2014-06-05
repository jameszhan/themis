//= require modules/calendar
//= require modules/resources
//= require modules/datetimepicker
//= require modules/directives
//= require modules/filters

angular.module('tasksApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datetimepicker', 'local.directives', 'local.filters', 'local.calendar', 'local.resources']);

function TaskModalCtrl($scope, $modalInstance, selectedTask, container, Task, Modal){
    Modal.closable($scope, $modalInstance);
    $scope.title = "任务";
    $scope.task = selectedTask;

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.doSubmit = function() {
        if (!$scope.task.id) {
            $scope.task.$save()
                .then(function(e) {
                    container.push(e);
                })
                .finally(function() {
                    $modalInstance.dismiss('close');
                });
        } else {
            Task.update({id: $scope.task.id}, $scope.task).$promise.then(function(){
                $modalInstance.dismiss('close');
            });
        }
    }
}

function TaskCtrl($scope, $modal, Task, Config, Util) {
    $scope.events = [];

    angular.forEach(['importances', 'urgencies', 'durations', 'progresses'], function(configName){
        Config.get({id: configName}).$promise.then(function(config){
            $scope[configName] = config.data;
        });
    });

    $scope.updateResources = function(view){
        $scope.events.length = 0; //clear the array.
        Task.query({started_at: view.visStart.getTime() / 1000, stoped_at: view.visEnd.getTime() / 1000}).$promise.then(function(data){
            angular.forEach(data, function(e){
                $scope.events.push(e);
            });
        });
    };

    /* remove event */
    $scope.remove = function(e) {
        var index = -1;
        for(var i = 0; i < $scope.events.length; i++) {
            if (e == $scope.events[i]) {
                index = i;
                break;
            }
        }
        if (index >= 0 && e) {
            e.$delete();
            $scope.events.splice(index, 1);
        }
    };

    $scope.edit = function(event){
        console.log(event);
        openTaskModal(event, null).then(function(r){});
    };

    $scope.dayClick = function(date, allDay, $event, view){
        openTaskModal(null, date).then(function(r){});
    };

    $scope.renderEvent = function(event, el, view){
        //console.log(event, el, view);
    };

    $scope.eventOnClick = function(event, $event, view){
        Util.preview(event.desc);
    };


    $scope.eventOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, $event, ui, view){
        Task.update({id: event.id}, event);
    };

    $scope.eventOnResize = function(){
        //console.log(arguments);
    };

    function openTaskModal(task, date){
        return $modal.open({
            templateUrl: 'templates/modal/task.tpl',
            size: 'md', //'sm', 'lg'
            controller: 'TaskModalCtrl',
            scope: $scope,
            resolve: {
                selectedTask: function(){
                    if (!task) {
                        return new Task({duration: 0, importance: 0, urgency: 0, progress: 0, start: date});
                    }
                    return task;
                },
                container: function(){
                    return $scope.events;
                }
            }
        }).opened;
    }

}


function TaskTableCtrl($scope, $modal, Task, Config, Binder) {
    $scope.pageSize = 5;
    Binder.pagable($scope, 'tasks', function(i){
        return Task.search({page: i, per_page: $scope.pageSize}).$promise;
    });

    $scope.tasks = [];
    $scope.selected || ($scope.selected = {});

    $scope.minMsg = "你至少应该选择{0}个任务.";
    $scope.maxMsg = "你不能选择超过{0}个任务.";

    $scope.doAdd = function(){
        return openTaskModal(null, new Date()).then(function(r){});
    };

    $scope.doEdit = function() {
        Binder.bind($scope, 'tasks').select(1, 1).then(function(tasks) {
            return openTaskModal(tasks[0], null).then(function(r){});
        });
    };

    $scope.doRemove = function(){
        Binder.bind($scope, 'tasks').select(1, 10).confirm('你确定要移除它们吗，此操作将无法恢复!').then(function(tasks){
            angular.forEach(tasks, function(task){
                new Task({id: task.id}).$delete().then(function(data){
                    var index = $scope.tasks.indexOf(task);
                    $scope.tasks.splice(index, 1);
                });
            });
        });
    };

    function openTaskModal(task, date){
        return $modal.open({
            templateUrl: 'templates/modal/task.tpl',
            size: 'md', //'sm', 'lg'
            controller: 'TaskModalCtrl',
            scope: $scope,
            resolve: {
                selectedTask: function(){
                    if (!task) {
                        return new Task({duration: 0, importance: 0, urgency: 0, progress: 20, start: date});
                    }
                    return task;
                },
                container: function(){
                    return $scope.tasks;
                }
            }
        }).opened;
    }

    angular.forEach(['importances', 'urgencies', 'durations', 'progresses'], function(configName){
        Config.get({id: configName}).$promise.then(function(config){
            $scope[configName] = config.data;
        });
    });
}
