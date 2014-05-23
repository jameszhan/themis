//= require modules/calendar

angular.module('tasksApp', ['ui.calendar', 'ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datepicker', 'local.modules', 'services'])
    .config(function($httpProvider){
        var csrfToken = $("meta[name='csrf-token']").attr("content");
        $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    });


function TaskModalCtrl($scope, $modalInstance, selectedDate, Task){
    $scope.selectedDate = selectedDate;
    $scope.ok = function(){
        $modalInstance.close($scope.selectedDate);
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

    $scope.task = new Task({duration: 0, importance: 0, urgency: 0});

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

    $scope.doSubmit = function(){
        $scope.task.$save();
    }

}

function TaskCtrl($scope, $compile, $modal, Task, Modal) {
    $scope.events = [];
    Task.query().$promise.then(function(data){
        angular.forEach(data, function(e){
            e.url = '';
            e.title = e.name;
            $scope.events.push(e);
        });
    });
}
/* EOF */


/******************************* Calendar Start ******************************/
/*

function TaskCalendarCtrl($scope, $dialog, $routeParams, DataCenter, Util){
    var today = Date.begin_of_date(new Date());
    var d = today.getDate(), m = today.getMonth(), y = today.getFullYear();
    $scope.events = [];
    $scope.event_sources = [$scope.events];

    $scope.priorities = [{name: '低', value: 10}, {name: '普通', value: 5}, {name: '高', value: 0}];

    DataCenter.tasks({id: $routeParams.id}, function(data){
        angular.forEach(data, function(v){
            $scope.events.push(v);
        });
    });

    $scope.add_task = function() {
        open_dialog(today, null);
    };

    $scope.day_click = function(date, all_day, js_event, view){
        if(date >= today){
            $scope.$apply(function(){
                open_dialog(date, null);
            });
        }
    };

    $scope.event_on_drop = function(event, day_delta, minute_delta, all_day, revert_func, js_event, ui, view){
        $scope.$apply(function(){
            DataCenter.update_task({id: $scope.datacenter.id, task: {id: event.id, day_delta: day_delta, minute_delta: minute_delta, all_day: all_day}});
        });
    };

    $scope.event_on_resize = function(event, day_delta, minute_delta, revert_func, js_event, ui, view){
        $scope.$apply(function(){
            $scope.alert_message = ('Event Resized to make dayDelta ' + minute_delta);
        });
    };

    $scope.edit_task = function(cal_event, e, view) {
        $scope.$apply(function(){
            open_dialog(today, cal_event);
        });
    };

    $scope.remove = function(index, e) {
        remove_event($scope.events, e);
    };


    $scope.change_view = function(view) {
        $scope.current_calendar.fullCalendar('changeView', view);
    };


    $scope.ui_config = {
        calendar:{
            height: 450,
            editable: true,
            ignoreTimezone: false,
            header:{
                left: 'month basicWeek basicDay',
                center: 'title',
                right: 'agendaWeek agendaDay, today prev,next'
            },

            // time formats
            titleFormat: {
                month: 'MMMM yyyy',
                week: "MMMd - {MMMd}",
                day: 'dddd, MMMd, yyyy'
            },
            columnFormat: {
                month: 'ddd',
                week: 'ddd M/d',
                day: 'dddd M/d'
            },
            timeFormat: { // for event elements
                '': 'h(:mm)t' // default
            },

            // locale
            isRTL: false,
            firstDay: 0,
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['日','一','二','三','四','五','六'],
            buttonText: {
                prev: '&nbsp;&#9668;&nbsp;',
                next: '&nbsp;&#9658;&nbsp;',
                prevYear: '&nbsp;&lt;&lt;&nbsp;',
                nextYear: '&nbsp;&gt;&gt;&nbsp;',
                today: '今天',
                month: '月',
                week: '星期',
                day: '天'
            },
            dayClick: $scope.day_click,
            eventDrop: $scope.event_on_drop,
            eventResize: $scope.event_on_resize,
            eventClick: $scope.edit_task,
            eventRender: function(event, element) {
                var clazz = "event_at_" + event.priority;
                if(event.start < today){
                    clazz = "event_expired";
                }
                element.addClass(clazz).find('span.fc-event-title').append('<span class="pull-right"><i class="icon-pencil"></i><i class="icon-trash"><i></span>');
                element.on('click', '.icon-trash', function(e){
                    if(window.confirm("你真的确定要删除这个事件吗?")){
                        $scope.$apply(function(){
                            $scope.remove(-1, event);
                        });
                    }
                    e.stopPropagation();
                });
            }
        }
    };

    function remove_event(c, e){
        var index = -1;
        for(var i = 0; i < c.length; i++){
            if(e.id == c[i].id){
                index = i;
                break;
            }
        }
        if(index >= 0){
            c.splice(index, 1);
        }else{
            alert("你所选的事件不存在");
        }
    }

    function open_dialog(date, event){
        $scope.selected_event = event;
        $scope.selected_date = date;
        Util.dialog("/partials/datacenters/_task.html", 'TaskCalendarDialogCtrl', $scope, {backdropClick: false, dialogClass: 'modal mini'});
    }
}

*/


/******************************* Calendar End ******************************/