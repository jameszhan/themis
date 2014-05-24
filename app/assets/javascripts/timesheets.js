//= require modules/calendar
//= require modules/resources

angular.module('timeSheetsApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datepicker', 'local.calendar', 'local.resources']);

function TimesheetCtrl($scope, $compile, $modal, Timesheet) {
    $scope.events = [];

    $scope.updateResources = function(view){
        $scope.events.length = 0; //clear the array.
        Timesheet.query({dateStart: view.visStart.getTime() / 1000, dateEnd: view.visEnd.getTime() / 1000}).$promise.then(function(data){
            angular.forEach(data, function(e){
                e.url = '';
                e.title = e.name;
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
        }).result;
    }
}
/* EOF */