//= require modules/calendar
//= require modules/resources
//= require modules/datetimepicker

angular.module('timesheetsApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datetimepicker', 'local.resources', 'local.calendar']);

function TimesheetCtrl($scope, $modal, Timesheet, Config) {
    $scope.events = [];

    $scope.updateResources = function(view){
        $scope.events.length = 0; //clear the array.
        Timesheet.query({started_at: view.visStart.getTime() / 1000, stoped_at: view.visEnd.getTime() / 1000}).$promise.then(function(data){
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
        event.completed_at = event.start;
        event.started_at = event.start;

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
                        return new Timesheet({category_id: 1, started_at: date, completed_at: date});
                    }
                    return timesheet;
                }
            }
        }).opened;
    }


    Config.get({id: 'categories'}).$promise.then(function(config){
        $scope.categories = config.data;
    });
}

function TimesheetModalCtrl($scope, $modalInstance, Modal, Timesheet, selectedTimesheet) {
    Modal.closable($scope, $modalInstance);
    $scope.title = '时间表';
    $scope.timesheet = selectedTimesheet;

    $scope.open = function($event, whichKey) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[whichKey] = true;
    };

    $scope.doSubmit = function() {
        if (!$scope.timesheet.id) {
            $scope.timesheet.$save()
                .then(function(e) {
                    $scope.events.push(e);
                })
                .finally(function() {
                    $modalInstance.dismiss('close');
                });
        } else {
            Timesheet.update({id: $scope.timesheet.id}, $scope.timesheet).$promise.then(function(){
                $modalInstance.dismiss('close');
            });
        }
    }
}