//= require modules/calendar
//= require modules/resources
//= require modules/datetimepicker


var MINUTE_MS = 60 * 1000,
    HOUR_MS = MINUTE_MS * 60,
    DAY_MS  = HOUR_MS * 24,
    MONTH_MS = DAY_MS * 30,
    YEAR_MS = DAY_MS * 365;

angular.module('tasksApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datetimepicker', 'local.calendar', 'local.resources']);

function TaskModalCtrl($scope, $modalInstance, selectedTask, Task, Config, Modal){
    Modal.closable($scope, $modalInstance);
    $scope.title = "任务";
    $scope.task = selectedTask;

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    angular.forEach(['importances', 'urgencies', 'durations'], function(configName){
        Config.get({id: configName}).$promise.then(function(config){
            $scope[configName] = config.data;
        });
    });


    $scope.doSubmit = function() {
        if (!$scope.task.id) {
            $scope.task.$save()
                .then(function(e) {
                    $scope.events.push(e);
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

function TaskCtrl($scope, $modal, Task) {
    $scope.events = [];

    $scope.updateResources = function(view){
        $scope.events.length = 0; //clear the array.
        Task.query({started_at: view.visStart.getTime() / 1000, stoped_at: view.visEnd.getTime() / 1000}).$promise.then(function(data){
            angular.forEach(data, function(e){
                $scope.events.push(e);
            });
        });
    };

    /* remove event */
    $scope.remove = function(id) {
        var index = -1, event = null;
        for(var i = 0; i < $scope.events.length; i++) {
            if (id == $scope.events[i].id) {
                index = i;
                event = $scope.events[i];
                break;
            }
        }
        if (index >= 0 && event) {
            event.$delete();
            $scope.events.splice(index, 1);
        }
    };

    $scope.dayClick = function(date, allDay, $event, view){
        openTaskModal(null, date).then(function(r){});
    };

    $scope.eventOnClick = function(event, $event, view){
        openTaskModal(event, null).then(function(r){});
    };

    $scope.eventOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, $event, ui, view){
        Task.update({id: event.id}, event);
    };

    $scope.eventOnResize = function(){
        console.log(arguments);
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
                        return new Task({duration: 0, importance: 0, urgency: 0, start: date});
                    }
                    return task;
                }
            }
        }).opened;
    }
}