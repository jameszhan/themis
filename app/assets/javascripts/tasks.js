//= require modules/calendar
//= require modules/resources


var MINUTE_MS = 60 * 1000,
    HOUR_MS = MINUTE_MS * 60,
    DAY_MS  = HOUR_MS * 24,
    MONTH_MS = DAY_MS * 30,
    YEAR_MS = DAY_MS * 365;

angular.module('tasksApp', ['ui.calendar', 'ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datepicker', 'local.calendar', 'local.resources'])


function TaskModalCtrl($scope, $modalInstance, selectedTask, Task){
    $scope.ok = function(){
        $modalInstance.close($scope.selectedTask);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.close = function() {
        $modalInstance.dismiss('close');
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.task = selectedTask;

    $scope.format = 'yyyy-MM-dd';

    $scope.importances = [
        {name: '非常重要', value: 100},
        {name: '重要', value: 80},
        {name: '一般', value: 50},
        {name: '不重要', value: 20},
        {name: '非常不重要', value: 0},
        {name: '浪费生命', value: -100}];
    $scope.urgencies = [
        {name: '非常紧急', value: 100},
        {name: '紧急', value: 80},
        {name: '一般', value: 50},
        {name: '不紧急', value: 20},
        {name: '非常不紧急', value: 0}];

    $scope.durations = [{name: '不限时间', value: 0}, {name: '1分钟', value: MINUTE_MS}, {name: '5分钟', value: 5 * MINUTE_MS},
        {name: '10分钟', value: 10 * MINUTE_MS}, {name: '30分钟', value: 30 * MINUTE_MS}, {name: '1小时', value: HOUR_MS},
        {name: '2小时', value: 2 * HOUR_MS}, {name: '3小时', value: 3 * HOUR_MS}, {name: '5小时', value: 5 * HOUR_MS},
        {name: '6小时', value: 6 * HOUR_MS}, {name: '8小时', value: 8 * HOUR_MS}, {name: '9小时', value: 9 * HOUR_MS},
        {name: '10小时', value: 10 * HOUR_MS}, {name: '12小时', value: 12 * HOUR_MS}, {name: '1天', value: DAY_MS},
        {name: '3天', value: 3 * DAY_MS}, {name: '10天', value: 10 * DAY_MS}, {name: '1个月', value: MONTH_MS},
        {name: '3个月', value: 3 * MONTH_MS}, {name: '6个月', value: 6 * MONTH_MS}, {name: '9个月', value: 9 * MONTH_MS},
        {name: '1年', value: YEAR_MS}, {name: '2年', value: 2 * YEAR_MS}, {name: '3年', value: 3 * YEAR_MS},
        {name: '5年', value: 5 * YEAR_MS}, {name: '8年', value: 8 * YEAR_MS}, {name: '10年', value: 10 * YEAR_MS},
        {name: '20年', value: 20 * YEAR_MS}, {name: '30年', value: 30 * YEAR_MS}, {name: '50年', value: 50 * YEAR_MS}];

    $scope.doSubmit = function() {
        if (!$scope.task.id) {
            $scope.task.$save()
                .then(function(e) {
                    e.url = '';
                    e.title = e.name;
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

function TaskCtrl($scope, $compile, $modal, Task) {
    $scope.events = [];
    Task.query({urgency: 0}).$promise.then(function(data){
        angular.forEach(data, function(e){
            e.url = '';
            e.title = e.name;
            $scope.events.push(e);
        });
    });

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
        }).result;
    }
}
/* EOF */

