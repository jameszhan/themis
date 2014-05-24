//= require jquery-ui/jquery.ui.core
//= require jquery-ui/jquery.ui.widget
//= require jquery-ui/jquery.ui.mouse
//= require jquery-ui/jquery.ui.draggable
//= require jquery-ui/jquery.ui.resizable
//= require fullcalendar/fullcalendar
//= require fullcalendar/gcal
//= require angular-ui/calendar
//= require modules/services
//= require modules/lunar

angular.module('local.calendar', ['ui.calendar', 'local.services', "local.globals"])
    .controller('CalendarController', ['$scope', '$compile', 'Modal', 'Lunar', function($scope, $compile, Modal, Lunar){
        'use strict';
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources, source) {
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
            el.attr('tooltip', event.desc);
            el.addClass("event-urgency-" + event.urgency)
                .addClass("event-importance-" + event.urgency)
                .find('span.fc-event-title')
                .append('<span class="pull-right"><i class="glyphicon glyphicon-pencil"></i><i class="glyphicon glyphicon-trash"><i></span>');
            el.on('click', '.glyphicon-trash', function(e){
                Modal.confirm("你真的确定要删除这个事件吗?", function(){
                    $scope.remove(event.id);
                });
                e.stopPropagation();
            });

            $compile(el)($scope);
        };

        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 650,
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
                eventClick: $scope.eventOnClick || angular.noop,
                eventDrop: $scope.eventOnDrop || angular.noop,
                eventResize: $scope.eventOnResize || angular.noop,
                viewRender: function(view, el){
                    el.find(".fc-day").each(function(i, e){
                        var $this = $(e),
                            lunar = Lunar.t(new Date($this.data('date')));
                        $this.prepend("<b class='lunar'>" + lunar.toString() + "</b>");
                    });
                    return ($scope.updateResources || angular.noop)(view);
                },
                eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.events];
    }]);

