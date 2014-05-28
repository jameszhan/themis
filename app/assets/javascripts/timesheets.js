//= require modules/calendar
//= require modules/resources
//= require modules/datetimepicker
//= require modules/filters

angular.module('timesheetsApp', ['ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datetimepicker', 'local.filters', 'local.resources', 'local.calendar']);

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
        openTimesheetModal(event, null).then(function(r){});
    };


    $scope.dayClick = function(date, allDay, $event, view){
        openTimesheetModal(null, date).then(function(r){});
    };

    /*
    $scope.eventOnClick = function(event, $event, view){
        openTimesheetModal(event, null).then(function(r){});
    };
    */

    $scope.eventOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, $event, ui, view){
        event.completed_at = event.start;
        event.started_at = event.start;

        Timesheet.update({id: event.id}, event);
    };

    $scope.eventOnResize = function(){
        console.log(arguments);
    };

    function openTimesheetModal(timesheet, date){
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
                },
                container: function(){
                    return $scope.events;
                }
            }
        }).opened;
    }


    Config.get({id: 'categories'}).$promise.then(function(config){
        $scope.categories = config.data;
    });
}

function TimesheetTableCtrl($scope, $modal, Timesheet, Binder) {
    $scope.timesheets = [];
    Timesheet.query().$promise.then(function(data){
        $scope.timesheets = data;
    });

    $scope.selected || ($scope.selected = {});
    Binder.pagination($scope, 'timesheets', 10);

    $scope.minMsg = "你至少应该选择{0}个任务.";
    $scope.maxMsg = "你不能选择超过{0}个任务.";

    $scope.doAdd = function(){
        return openTimesheetModal(null, new Date()).then(function(r){});
    };

    $scope.doEdit = function() {
        Binder.bind($scope, 'timesheets').select(1, 1).then(function(timesheets) {
            return openTimesheetModal(timesheets[0], null).then(function(r){});
        });
    };

    $scope.doRemove = function(){
        Binder.bind($scope, 'timesheets').select(1, 10).confirm('你确定要移除它们吗，此操作将无法恢复!').then(function(timesheets){
            angular.forEach(timesheets, function(timesheet){
                timesheet.$delete().then(function(data){
                    var index = $scope.timesheets.indexOf(timesheet);
                    $scope.timesheets.splice(index, 1);
                });
            });
        });
    };


    function openTimesheetModal(timesheet, date){
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
                },
                container: function(){
                    return $scope.timesheets;
                }
            }
        }).opened;
    }
}


function TimesheetModalCtrl($scope, $modalInstance, Modal, Timesheet, Config, selectedTimesheet, container) {
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
                    container.push(e);
                })
                .finally(function() {
                    $modalInstance.dismiss('close');
                });
        } else {
            Timesheet.update({id: $scope.timesheet.id}, $scope.timesheet).$promise.then(function(){
                $modalInstance.dismiss('close');
            });
        }
    };

    if (!$scope.categories) {
        Config.get({id: 'categories'}).$promise.then(function(config){
            $scope.categories = config.data;
        });
    }
}