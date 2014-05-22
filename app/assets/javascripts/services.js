angular.module('services', ['ngResource', 'ui.bootstrap.modal'])
    .factory('Task', function($resource) {
        return $resource('tasks/:id.json', {id: '@id'});
    })
    .factory('Modal', function($modal){
        var messageBox = function(title, msg, btns, callback){
            $modal.open({
                template: msg,
            }).result.then(function(result){
                (callback || angular.noop)(result);
            });
        };
        return {
            alert: function(msg){
                var btns = [{result:'ok', label: '确定', cssClass: 'btn-primary mini'}];
                messageBox("提示信息", msg, btns);
            },
            confirm: function(msg, succ, fail){
                var btns = [{result: false, label: '取消'}, {result: true, label: '确定', cssClass: 'btn-primary mini'}];
                messageBox("提示信息", msg, btns, function(result){
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