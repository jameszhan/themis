/**
 * calendarDemoApp - 0.8.1
 */

//= require services
angular.module('tasksApp', ['ui.calendar', 'ui.bootstrap', 'services']);


function CalendarCtrl($scope, $compile, Task, Modal) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var today = new Date();

    /* event source that pulls from google.com */
    $scope.eventSource = {
        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    /*$scope.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    */
    Modal.alert("hello");
    $scope.events = [];
    Task.query().$promise.then(function(data){
        $scope.events = data;
    });

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
        callback(events);
    };

    $scope.calEventsExt = {
        color: '#f00',
        textColor: 'yellow',
        events: [
            {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
            {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
            {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        $scope.alertMessage = (event.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
        var canAdd = 0;
        angular.forEach(sources,function(value, key){
            if(sources[key] === source){
                sources.splice(key,1);
                canAdd = 1;
            }
        });
        if(canAdd === 0){
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function() {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view, calendar) {
        calendar.fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
        if(calendar){
            calendar.fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr('tooltip', event.title);
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
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

            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
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
            /* eventRender: $scope.eventRender*/
        }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
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