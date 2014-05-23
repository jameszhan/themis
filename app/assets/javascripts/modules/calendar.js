//= require jquery-ui/jquery.ui.core
//= require jquery-ui/jquery.ui.widget
//= require jquery-ui/jquery.ui.mouse
//= require jquery-ui/jquery.ui.draggable
//= require jquery-ui/jquery.ui.resizable
//= require fullcalendar/fullcalendar
//= require fullcalendar/gcal
//= require angular-ui/calendar

var MINUTE_MS = 60 * 1000,
    HOUR_MS = MINUTE_MS * 60,
    DAY_MS  = HOUR_MS * 24,
    MONTH_MS = DAY_MS * 30,
    YEAR_MS = DAY_MS * 365;

angular.module('local.calendar', ['ui.calendar', 'ui.bootstrap'])
    .controller('CalendarController', ['$scope', '$compile', function($scope, $compile){
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var today = new Date();

        /* alert on eventClick */
        $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
            $scope.alertMessage = (event.title + ' was clicked ');
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
            $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
        };

        $scope.eventOnDrop = function(event, day_delta, minute_delta, all_day, revert_func, js_event, ui, view){
            console.log(arguments);
            $scope.$apply(function(){

            });
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
        $scope.remove = function(id) {
            var index = -1;
            for(var i = 0; i < $scope.events.length; i++) {
                if (id == $scope.events[i].id) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                $scope.events.splice(index, 1);
            }
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

        $scope.eventRender = function(event, el, view) {
            //el.attr('tooltip', event.title);
            el.addClass("event-urgency-" + event.urgency)
                .addClass("event-importance-" + event.urgency)
                .find('span.fc-event-title')
                .append('<span class="pull-right"><i class="glyphicon glyphicon-pencil"></i><i class="glyphicon glyphicon-trash"><i></span>');
            el.on('click', '.glyphicon-trash', function(e){
                if(window.confirm("你真的确定要删除这个事件吗?")){
                    $scope.$apply(function(){
                        $scope.remove(event.id);
                    });
                }
                e.stopPropagation();
            });

            $compile(el)($scope);
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
                dayClick: $scope.dayClick || angular.noop,
                eventClick: angular.noop,//$scope.alertOnEventClick,
                eventDrop: angular.noop, //$scope.eventOnDrop,
                eventResize: angular.noop, //$scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.events];
    }]);

