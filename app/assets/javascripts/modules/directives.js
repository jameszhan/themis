angular.module('local.directives', ['local.services'])
    .directive('dataPreview', ['$compile', 'Util', function($compile, Util){
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element, attrs) {
                console.log($compile(element));
                var text = element.text();
                if (text.length > attrs.dataPreview) {
                    element.text(text.substr(attrs.dataPreview));
                }
                element.on('click', function(e){
                    Util.preview(text);
                });
            }
        };
    }]);