angular.module('local.filters', [])
    .filter('startFrom', function () {
        return function (input, start) {
            input || (input = []);
            start = +start; //parse to int
            return input.slice(start);
        }
    })
    .filter('range', function () {
        return function (input, total) {
            for (var i = 0; i < total; i++) {
                input.push(i);
            }
            return input;
        };
    });