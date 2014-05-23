angular.module('local.services', ['ngResource', 'ui.bootstrap.modal'])
    .controller('MessageBoxController', ['$scope', '$modalInstance', 'model', function($scope, $modalInstance, model){
        $scope.title = model.title;
        $scope.message = model.message;
        $scope.buttons = model.buttons;

        $scope.close = function(result) {
            if (result) {
                (model.succ || angular.noop)();
            } else {
                (model.fail || angular.noop)();
            }
            $modalInstance.close(result);
        };
    }])
    .factory('Modal', function($modal){
        var messageBox = function(title, msg, btns, succ, fail){
            return $modal.open({
                templateUrl: 'templates/modal/message_box.tpl',
                controller: 'MessageBoxController',
                size: 'sm',
                resolve: {
                    model: function() {
                        return {
                            title: title,
                            message: msg,
                            buttons: btns,
                            succ: succ,
                            fail: fail
                        };
                    }
                }
            }).opened;
        };

        return {
            alert: function(msg, title){
                var btns = [{result:'ok', label: '确定', cssClass: 'btn-primary mini'}];
                return messageBox(title || "提示信息", msg, btns);
            },
            confirm: function(msg, succ, fail, title){
                var btns = [{result: false, label: '取消'}, {result: true, label: '确定', cssClass: 'btn-primary mini'}];
                return messageBox(title || "提示信息", msg, btns, succ, fail);
            }
        };
    });