angular.module('local.services', ['ngResource', 'ui.bootstrap.modal'])
    .controller('MessageBoxController', ['$scope', 'model', function($scope, model){
        $scope.title = model.title;
        $scope.message = model.message;
        $scope.buttons = model.buttons;
    }])
    .factory('Modal', function($modal){
        var messageBox = function(title, msg, btns){
            return $modal.open({
                templateUrl: 'templates/modal/message_box.tpl',
                controller: 'MessageBoxController',
                resolve: {
                    model: function() {
                        return {
                            title: title,
                            message: msg,
                            buttons: btns
                        };
                    }
                }
            }).result;
        };
        return {
            alert: function(msg, title){
                var btns = [{result:'ok', label: '确定', cssClass: 'btn-primary mini'}];
                messageBox(title || "提示信息", msg, btns);
            },
            confirm: function(msg, succ, fail, title){
                var btns = [{result: false, label: '取消'}, {result: true, label: '确定', cssClass: 'btn-primary mini'}];
                messageBox(title || "提示信息", msg, btns, function(result){
                    if(result){
                        (succ || angular.noop)();
                    }else{
                        (fail || angular.noop)();
                    }
                });
            },
            dialog: function(templateUrl, controller, $scope, opts){
                var options = angular.extend({
                    backdrop: true,
                    keyboard: true,
                    backdropClick: true,
                    templateUrl: templateUrl,
                    controller: controller
                }, opts);
                var d = $dialog.dialog(options);
                d.context_scope = $scope;
                d.open().then(function(result){
                    if(result){
                        alert('dialog closed with result: ' + result);
                    }
                });
            }
        };
    });