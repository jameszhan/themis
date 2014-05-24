//= require modules/calendar
//= require modules/resources
//= require modules/datetimepicker

angular.module('timeSheetsApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datetimepicker', 'local.resources', 'local.calendar']);

function TimesheetCtrl($scope, $modal, Timesheet) {
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
        Timesheet.update({id: event.id}, event);
    };

    $scope.eventOnResize = function(){
        console.log(arguments);
    };

    function openTaskModal(timesheet, date){
        return $modal.open({
            templateUrl: 'templates/modal/timesheet.tpl',
            size: 'md', //'sm', 'lg'
            controller: 'TimesheetModalCtrl',
            scope: $scope,
            resolve: {
                selectedTimesheet: function(){
                    if (!timesheet) {
                        return new Timesheet({categoryId: 1, startTime: date, endTime: date});
                    }
                    return timesheet;
                }
            }
        }).opened;
    }
}

function TimesheetModalCtrl($scope, $modalInstance, Modal, selectedTimesheet, Config) {
    Modal.closable($scope, $modalInstance);
    $scope.title = '时间表';
    $scope.timesheet = selectedTimesheet;
    $scope.dateFormat = 'yyyy-MM-dd';
    $scope.timeFormat = "hh:mm:ss";

    $scope.open = function($event, whichKey) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[whichKey] = true;
    };

    $scope.categories = [];
    Config.categories().$promise.then(function(data){
        $scope.categories = data;
    });
}