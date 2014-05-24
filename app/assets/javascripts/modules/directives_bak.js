//= require bootstrap-datetimepicker/bootstrap-datetimepicker

angular.module("template/datetimepicker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/datetimepicker.html",
        "<div class='datetimepicker'>" +
            "<table class='table-condensed'>" +
            "   <thead>" +
            "       <tr>" +
            "           <th class='left'" +
            "               data-ng-click=\"changeView(data.currentView, data.leftDate, $event)\"" +
            "               ><i class='glyphicon glyphicon-arrow-left'/></th>" +
            "           <th class='switch' colspan='5'" +
            "               data-ng-click=\"changeView(data.previousView, data.currentDate, $event)\"" +
            ">{{ data.title }}</th>" +
            "           <th class='right'" +
            "               data-ng-click=\"changeView(data.currentView, data.rightDate, $event)\"" +
            "             ><i class='glyphicon glyphicon-arrow-right'/></th>" +
            "       </tr>" +
            "       <tr>" +
            "           <th class='dow' data-ng-repeat='day in data.dayNames' >{{ day }}</th>" +
            "       </tr>" +
            "   </thead>" +
            "   <tbody>" +
            '       <tr data-ng-class=\'{ hide: data.currentView == "day" }\' >' +
            "           <td colspan='7' >" +
            "              <span    class='{{ data.currentView }}' " +
            "                       data-ng-repeat='dateValue in data.dates'  " +
            "                       data-ng-class='{active: dateValue.active, past: dateValue.past, future: dateValue.future}' " +
            "                       data-ng-click=\"changeView(data.nextView, dateValue.date, $event)\">{{ dateValue.display }}</span> " +
            "           </td>" +
            "       </tr>" +
            '       <tr data-ng-show=\'data.currentView == "day"\' data-ng-repeat=\'week in data.weeks\'>' +
            "           <td data-ng-repeat='dateValue in week.dates' " +
            "               data-ng-click=\"changeView(data.nextView, dateValue.date, $event)\"" +
            "               class='day' " +
            "               data-ng-class='{active: dateValue.active, past: dateValue.past, future: dateValue.future}' >{{ dateValue.display }}</td>" +
            "       </tr>" +
            "   </tbody>" +
            "</table></div>");
}]);

angular.module('ui.bootstrap.datetimepicker', ['template/datetimepicker.html'])
    .constant('datetimePickerConfig', {
        formatDay: 'dd',
        formatMonth: 'MMMM',
        formatYear: 'yyyy',
        formatDayHeader: 'EEE',
        formatDayTitle: 'MMMM yyyy',
        formatMonthTitle: 'yyyy',
        datepickerMode: 'day',
        minMode: 'day',
        maxMode: 'year',
        showWeeks: true,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null,

        minuteStep: 5,
        minView: 'minute',
        startView: 'day',
        weekStart: 0
    })
    .constant('datetimePickerConfigValidation', function (configuration) {
        "use strict";

        // Order of the elements in the validViews array is significant.
        var validViews = ['minute', 'hour', 'day', 'month', 'year'];

        if (validViews.indexOf(configuration.startView) < 0) {
            throw ("invalid startView value: " + configuration.startView);
        }

        if (validViews.indexOf(configuration.minView) < 0) {
            throw ("invalid minView value: " + configuration.minView);
        }

        if (validViews.indexOf(configuration.minView) > validViews.indexOf(configuration.startView)) {
            throw ("startView must be greater than minView");
        }

        if (!angular.isNumber(configuration.minuteStep)) {
            throw ("minuteStep must be numeric");
        }
        if (configuration.minuteStep <= 0 || configuration.minuteStep >= 60) {
            throw ("minuteStep must be greater than zero and less than 60");
        }

        if (!angular.isNumber(configuration.weekStart)) {
            throw ("weekStart must be numeric");
        }
        if (configuration.weekStart < 0 || configuration.weekStart > 6) {
            throw ("weekStart must be greater than or equal to zero and less than 7");
        }
    })
    .constant('datetimePickerPopupConfig', {
        datepickerPopup: 'yyyy-MM-dd hh:mm:ss',
        currentText: 'Today',
        clearText: 'Clear',
        closeText: 'Done',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true
    })
    .controller('DatetimePickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datetimePickerConfig', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
        var self = this;
        // Key event mapper
        $scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

        var focusElement = function() {
            $timeout(function() {
                console.log(self);
                //self.element[0].focus();
            }, 0 , false);
        };

        // Listen for focus requests from popup directive
        $scope.$on('datetimepicker.focus', focusElement);

        $scope.keydown = function(evt) {
            var key = $scope.keys[evt.which];

            if (!key || evt.shiftKey || evt.altKey) {
                return;
            }

            evt.preventDefault();
            evt.stopPropagation();

            if (key === 'enter' || key === 'space') {
                if ( self.isDisabled(self.activeDate)) {
                    return; // do nothing
                }
                $scope.select(self.activeDate);
                focusElement();
            } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
                $scope.toggleMode(key === 'up' ? 1 : -1);
                focusElement();
            } else {
                self.handleKeyDown(key, evt);
                self.refreshView();
            }
        };

        /*


        var self = this,
            ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

        // Modes chain
        this.modes = ['day', 'month', 'year'];

        // Configuration attributes
        angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
            'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange'], function( key, index ) {
            self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
        });

        // Watchable attributes
        angular.forEach(['minDate', 'maxDate'], function( key ) {
            if ( $attrs[key] ) {
                $scope.$parent.$watch($parse($attrs[key]), function(value) {
                    self[key] = value ? new Date(value) : null;
                    self.refreshView();
                });
            } else {
                self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
            }
        });

        $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
        $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
        this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();

        $scope.isActive = function(dateObject) {
            if (self.compare(dateObject.date, self.activeDate) === 0) {
                $scope.activeDateId = dateObject.uid;
                return true;
            }
            return false;
        };

        this.init = function( ngModelCtrl_ ) {
            ngModelCtrl = ngModelCtrl_;

            ngModelCtrl.$render = function() {
                self.render();
            };
        };

        this.render = function() {
            if ( ngModelCtrl.$modelValue ) {
                var date = new Date( ngModelCtrl.$modelValue ),
                    isValid = !isNaN(date);

                if ( isValid ) {
                    this.activeDate = date;
                } else {
                    $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                }
                ngModelCtrl.$setValidity('date', isValid);
            }
            this.refreshView();
        };

        this.refreshView = function() {
            if ( this.element ) {
                this._refreshView();

                var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
                ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
            }
        };

        this.createDateObject = function(date, format) {
            var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
            return {
                date: date,
                label: dateFilter(date, format),
                selected: model && this.compare(date, model) === 0,
                disabled: this.isDisabled(date),
                current: this.compare(date, new Date()) === 0
            };
        };

        this.isDisabled = function( date ) {
            return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
        };

        // Split array into smaller arrays
        this.split = function(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        };

        $scope.select = function( date ) {
            if ( $scope.datepickerMode === self.minMode ) {
                var dt = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
                dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
                ngModelCtrl.$setViewValue( dt );
                ngModelCtrl.$render();
            } else {
                self.activeDate = date;
                $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) - 1 ];
            }
        };

        $scope.move = function( direction ) {
            var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
                month = self.activeDate.getMonth() + direction * (self.step.months || 0);
            self.activeDate.setFullYear(year, month, 1);
            self.refreshView();
        };

        $scope.toggleMode = function( direction ) {
            direction = direction || 1;

            if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
                return;
            }

            $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) + direction ];
        };

        // Key event mapper
        $scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

        var focusElement = function() {
            $timeout(function() {
                self.element[0].focus();
            }, 0 , false);
        };

        // Listen for focus requests from popup directive
        $scope.$on('datepicker.focus', focusElement);

        $scope.keydown = function( evt ) {
            var key = $scope.keys[evt.which];

            if ( !key || evt.shiftKey || evt.altKey ) {
                return;
            }

            evt.preventDefault();
            evt.stopPropagation();

            if (key === 'enter' || key === 'space') {
                if ( self.isDisabled(self.activeDate)) {
                    return; // do nothing
                }
                $scope.select(self.activeDate);
                focusElement();
            } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
                $scope.toggleMode(key === 'up' ? 1 : -1);
                focusElement();
            } else {
                self.handleKeyDown(key, evt);
                self.refreshView();
            }
        };
        */
    }])
    .directive('datetimepicker', ['datetimePickerConfig', 'datetimePickerConfigValidation', function(defaultConfig, validateConfigurationFunction){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/datetimepicker.html',
            scope: {
                datepickerMode: '=?',
                dateDisabled: '&'
            },
            require: ['datetimepicker', '?^ngModel'],
            controller: 'DatetimePickerController',
            link: function(scope, element, attrs, ctrls) {
                var directiveConfig = {};

                if (attrs.datetimepickerConfig) {
                    directiveConfig = scope.$eval(attrs.datetimepickerConfig);
                }

                var configuration = {};

                angular.extend(configuration, defaultConfig, directiveConfig);

                validateConfigurationFunction(configuration);

                var dataFactory = {
                    year: function (unixDate) {
                        var selectedDate = moment.utc(unixDate).startOf('year');
                        // View starts one year before the decade starts and ends one year after the decade ends
                        // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
                        // Truncate the last digit from the current year and subtract 1 to get the start of the decade
                        var startDecade = (parseInt(selectedDate.year() / 10, 10) * 10);
                        var startDate = moment.utc(selectedDate).year(startDecade - 1).startOf('year');
                        var activeYear = scope.ngModel ? moment(scope.ngModel).year() : 0;

                        var result = {
                            'currentView': 'year',
                            'nextView': configuration.minView === 'year' ? 'setTime' : 'month',
                            'title': startDecade + '-' + (startDecade + 9),
                            'leftDate': moment.utc(startDate).subtract(9, 'year').valueOf(),
                            'rightDate': moment.utc(startDate).add(11, 'year').valueOf(),
                            'dates': []
                        };

                        for (var i = 0; i < 12; i++) {
                            var yearMoment = moment.utc(startDate).add(i, 'years');
                            var dateValue = {
                                'date': yearMoment.valueOf(),
                                'display': yearMoment.format('YYYY'),
                                'past': yearMoment.year() < startDecade,
                                'future': yearMoment.year() > startDecade + 9,
                                'active': yearMoment.year() === activeYear
                            };

                            result.dates.push(dateValue);
                        }

                        return result;
                    },

                    month: function (unixDate) {

                        var startDate = moment.utc(unixDate).startOf('year');

                        var activeDate = scope.ngModel ? moment(scope.ngModel).format('YYYY-MMM') : 0;

                        var result = {
                            'previousView': 'year',
                            'currentView': 'month',
                            'nextView': configuration.minView === 'month' ? 'setTime' : 'day',
                            'currentDate': startDate.valueOf(),
                            'title': startDate.format('YYYY'),
                            'leftDate': moment.utc(startDate).subtract(1, 'year').valueOf(),
                            'rightDate': moment.utc(startDate).add(1, 'year').valueOf(),
                            'dates': []
                        };

                        for (var i = 0; i < 12; i++) {
                            var monthMoment = moment.utc(startDate).add(i, 'months');
                            var dateValue = {
                                'date': monthMoment.valueOf(),
                                'display': monthMoment.format('MMM'),
                                'active': monthMoment.format('YYYY-MMM') === activeDate
                            };

                            result.dates.push(dateValue);
                        }

                        return result;
                    },

                    day: function (unixDate) {

                        var selectedDate = moment.utc(unixDate);
                        var startOfMonth = moment.utc(selectedDate).startOf('month');
                        var endOfMonth = moment.utc(selectedDate).endOf('month');

                        var startDate = moment.utc(startOfMonth).subtract(startOfMonth.weekday() - configuration.weekStart, 'days');

                        var activeDate = scope.ngModel ? moment(scope.ngModel).format('YYYY-MMM-DD') : '';

                        var result = {
                            'previousView': 'month',
                            'currentView': 'day',
                            'nextView': configuration.minView === 'day' ? 'setTime' : 'hour',
                            'currentDate': selectedDate.valueOf(),
                            'title': selectedDate.format('YYYY-MMM'),
                            'leftDate': moment.utc(startOfMonth).subtract(1, 'months').valueOf(),
                            'rightDate': moment.utc(startOfMonth).add(1, 'months').valueOf(),
                            'dayNames': [],
                            'weeks': []
                        };


                        for (var dayNumber = configuration.weekStart; dayNumber < configuration.weekStart + 7; dayNumber++) {
                            result.dayNames.push(moment.utc().weekday(dayNumber).format('dd'));
                        }

                        for (var i = 0; i < 6; i++) {
                            var week = { dates: [] };
                            for (var j = 0; j < 7; j++) {
                                var monthMoment = moment.utc(startDate).add((i * 7) + j, 'days');
                                var dateValue = {
                                    'date': monthMoment.valueOf(),
                                    'display': monthMoment.format('D'),
                                    'active': monthMoment.format('YYYY-MMM-DD') === activeDate,
                                    'past': monthMoment.isBefore(startOfMonth),
                                    'future': monthMoment.isAfter(endOfMonth)
                                };
                                week.dates.push(dateValue);
                            }
                            result.weeks.push(week);
                        }

                        return result;
                    },

                    hour: function (unixDate) {
                        var selectedDate = moment.utc(unixDate).hour(0).minute(0).second(0);

                        var activeFormat = scope.ngModel ? moment(scope.ngModel).format('YYYY-MM-DD H') : '';

                        var result = {
                            'previousView': 'day',
                            'currentView': 'hour',
                            'nextView': configuration.minView === 'hour' ? 'setTime' : 'minute',
                            'currentDate': selectedDate.valueOf(),
                            'title': selectedDate.format('YYYY-MMM-DD'),
                            'leftDate': moment.utc(selectedDate).subtract(1, 'days').valueOf(),
                            'rightDate': moment.utc(selectedDate).add(1, 'days').valueOf(),
                            'dates': []
                        };

                        for (var i = 0; i < 24; i++) {
                            var hourMoment = moment.utc(selectedDate).add(i, 'hours');
                            var dateValue = {
                                'date': hourMoment.valueOf(),
                                'display': hourMoment.format('H:00'),
                                'active': hourMoment.format('YYYY-MM-DD H') === activeFormat
                            };

                            result.dates.push(dateValue);
                        }

                        return result;
                    },

                    minute: function (unixDate) {
                        var selectedDate = moment.utc(unixDate).minute(0).second(0);

                        var activeFormat = scope.ngModel ? moment(scope.ngModel).format('YYYY-MM-DD H:mm') : '';

                        var result = {
                            'previousView': 'hour',
                            'currentView': 'minute',
                            'nextView': 'setTime',
                            'currentDate': selectedDate.valueOf(),
                            'title': selectedDate.format('YYYY-MMM-DD H:mm'),
                            'leftDate': moment.utc(selectedDate).subtract(1, 'hours').valueOf(),
                            'rightDate': moment.utc(selectedDate).add(1, 'hours').valueOf(),
                            'dates': []
                        };

                        var limit = 60 / configuration.minuteStep;

                        for (var i = 0; i < limit; i++) {
                            var hourMoment = moment.utc(selectedDate).add(i * configuration.minuteStep, 'minute');
                            var dateValue = {
                                'date': hourMoment.valueOf(),
                                'display': hourMoment.format('H:mm'),
                                'active': hourMoment.format('YYYY-MM-DD H:mm') === activeFormat
                            };

                            result.dates.push(dateValue);
                        }

                        return result;
                    },

                    setTime: function (unixDate) {
                        var tempDate = new Date(unixDate);
                        var newDate = new Date(tempDate.getTime() + (tempDate.getTimezoneOffset() * 60000));
                        if (configuration.dropdownSelector) {
                            jQuery(configuration.dropdownSelector).dropdown('toggle');
                        }
                        if (angular.isFunction(scope.onSetTime)) {
                            scope.onSetTime(newDate, scope.ngModel);
                        }
                        scope.ngModel = newDate;
                        return dataFactory[scope.data.currentView](unixDate);
                    }
                };

                var getUTCTime = function () {
                    var tempDate = (scope.ngModel ? moment(scope.ngModel).toDate() : new Date());
                    return tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000);
                };

                scope.changeView = function (viewName, unixDate, event) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    if (viewName && (unixDate > -Infinity) && dataFactory[viewName]) {
                        scope.data = dataFactory[viewName](unixDate);
                    }
                };

                scope.changeView(configuration.startView, getUTCTime());

                scope.$watch('ngModel', function () {
                    scope.changeView(scope.data.currentView, getUTCTime());
                });
            }
        };
    }])
    .directive('datetimepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser', 'datetimePickerPopupConfig', function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                isOpen: '=?',
                currentText: '@',
                clearText: '@',
                closeText: '@',
                dateDisabled: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                var dateFormat,
                    closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
                    appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

                scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

                scope.getText = function (key) {
                    return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
                };

                attrs.$observe('datetimepickerPopup', function (value) {
                    dateFormat = value || datepickerPopupConfig.datepickerPopup;
                    ngModel.$render();
                });

                // popup element used to display calendar
                var popupEl = angular.element('<div datepicker-popup-wrap><div datetimepicker></div></div>');
                popupEl.attr({
                    'ng-model': 'date',
                    'ng-change': 'dateSelection()'
                });

                function cameltoDash(string) {
                    return string.replace(/([A-Z])/g, function ($1) {
                        return '-' + $1.toLowerCase();
                    });
                }

                // datepicker element
                var datepickerEl = angular.element(popupEl.children()[0]);
                if (attrs.datepickerOptions) {
                    angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function (value, option) {
                        datepickerEl.attr(cameltoDash(option), value);
                    });
                }

                angular.forEach(['minDate', 'maxDate'], function (key) {
                    if (attrs[key]) {
                        scope.$parent.$watch($parse(attrs[key]), function (value) {
                            scope[key] = value;
                        });
                        datepickerEl.attr(cameltoDash(key), key);
                    }
                });
                if (attrs.dateDisabled) {
                    datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
                }

                function parseDate(viewValue) {
                    if (!viewValue) {
                        ngModel.$setValidity('date', true);
                        return null;
                    } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                        ngModel.$setValidity('date', true);
                        return viewValue;
                    } else if (angular.isString(viewValue)) {
                        var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
                        if (isNaN(date)) {
                            ngModel.$setValidity('date', false);
                            return undefined;
                        } else {
                            ngModel.$setValidity('date', true);
                            return date;
                        }
                    } else {
                        ngModel.$setValidity('date', false);
                        return undefined;
                    }
                }

                ngModel.$parsers.unshift(parseDate);

                // Inner change
                scope.dateSelection = function (dt) {
                    if (angular.isDefined(dt)) {
                        scope.date = dt;
                    }
                    ngModel.$setViewValue(scope.date);
                    ngModel.$render();

                    if (closeOnDateSelection) {
                        scope.isOpen = false;
                        element[0].focus();
                    }
                };

                element.bind('input change keyup', function () {
                    scope.$apply(function () {
                        scope.date = ngModel.$modelValue;
                    });
                });

                // Outter change
                ngModel.$render = function () {
                    var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
                    element.val(date);
                    scope.date = parseDate(ngModel.$modelValue);
                };

                var documentClickBind = function (event) {
                    if (scope.isOpen && event.target !== element[0]) {
                        scope.$apply(function () {
                            scope.isOpen = false;
                        });
                    }
                };

                var keydown = function (evt, noApply) {
                    scope.keydown(evt);
                };
                element.bind('keydown', keydown);

                scope.keydown = function (evt) {
                    if (evt.which === 27) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        scope.close();
                    } else if (evt.which === 40 && !scope.isOpen) {
                        scope.isOpen = true;
                    }
                };

                scope.$watch('isOpen', function (value) {
                    if (value) {
                        scope.$broadcast('datetimepicker.focus');
                        scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                        scope.position.top = scope.position.top + element.prop('offsetHeight');

                        $document.bind('click', documentClickBind);
                    } else {
                        $document.unbind('click', documentClickBind);
                    }
                });

                scope.select = function (date) {
                    if (date === 'today') {
                        var today = new Date();
                        if (angular.isDate(ngModel.$modelValue)) {
                            date = new Date(ngModel.$modelValue);
                            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                        } else {
                            date = new Date(today.setHours(0, 0, 0, 0));
                        }
                    }
                    scope.dateSelection(date);
                };

                scope.close = function () {
                    scope.isOpen = false;
                    element[0].focus();
                };

                var $popup = $compile(popupEl)(scope);
                if (appendToBody) {
                    $document.find('body').append($popup);
                } else {
                    element.after($popup);
                }

                scope.$on('$destroy', function () {
                    $popup.remove();
                    element.unbind('keydown', keydown);
                    $document.unbind('click', documentClickBind);
                });
            }
        };
    }]);

