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
            },
            closable: function(scope, $modalInstance){
                scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
                scope.close = function() {
                    $modalInstance.dismiss('close');
                };
            }
        };
    })
    .factory('Binder', function($q, Modal){
        return {
            bind: function(scope, target_name){
                scope.minMsg = (scope.minMsg || "你至少应该选择{0}个");
                scope.maxMsg = (scope.maxMsg || "你不能选择超过{0}个");
                var items = $.grep(scope[target_name], function(item) {
                    return scope.selected[item.id];
                }), _this = this, defer = $q.defer();
                return {
                    select: function(min, max){
                        if(items.length < min){
                            var msg = String.format(cope.minMsg, min);
                            Modal.alert(msg);
                            defer.reject(msg);
                        }
                        if(items.length > max){
                            var msg = String.format(scope.maxMsg, min);
                            Modal.alert(msg);
                            defer.reject(msg);
                        }
                        return {
                            then: function(fn){
                                defer.promise.then(fn);
                                defer.resolve(items);
                            },
                            confirm: function(msg){
                                Modal.confirm(msg, function(){
                                    defer.resolve(items);
                                }, function(){
                                    defer.reject('User Cancelled.');
                                });
                                return defer.promise;
                            }
                        };
                    }
                }
            },
            pagable: function(scope, targetName, search){
                scope.$watch('currentPage', function(current, _old){
                    if (current <= 1) {
                        scope.prevClass = 'disabled';
                    } else {
                        scope.prevClass = '';
                    }
                    if (current >= scope.pageCount){
                        scope.nextClass = 'disabled';
                    } else {
                        scope.nextClass = '';
                    }
                });
                scope.prev = function(){
                    if (scope.prevClass != 'disabled') {
                        doSearch(scope.currentPage - 1);
                    }
                };

                scope.page = function(i){
                    if (scope.currentPage != i) {
                        doSearch(i);
                    }
                };

                scope.next = function(){
                    if (scope.nextClass != 'disabled') {
                        doSearch(scope.currentPage + 1);
                    }
                };

                scope.pageSizeChange = function(){
                    doSearch(scope.currentPage);
                };

                scope.shouldHide = function(){
                    return scope.totalCount <= scope.pageSize;
                };

                scope.unselectedAll = function(){
                    scope.selectedAll = false;
                };

                scope.$watch('selectedAll', function(newValue, _oldValue){
                    if(newValue != undefined){
                        scope[targetName].filter(function(target, i){
                            scope.selected[target.id] = newValue;
                        });
                    }
                });

                function doSearch(i){
                    search(i).then(function(data){
                        scope[targetName] = data.items;
                        scope.totalCount = +data.total_count;
                        scope.pageSize = +data.page_size;
                        scope.pageCount = +data.page_count;
                        scope.currentPage = +data.page_index;
                    });
                }
                doSearch(1);
            },
            pagination: function(scope, targetName, pageSize){
                scope.currentPage = 0;
                scope.pageSize = pageSize;

                scope.$watch('currentPage', function(current, _old){
                    if (current == 0) {
                        scope.prevClass = 'disabled';
                    } else {
                        scope.prevClass = '';
                    }
                    if (current == scope.pageCount() - 1){
                        scope.nextClass = 'disabled';
                    } else {
                        scope.nextClass = '';
                    }
                });

                scope.prev = function(){
                    if(scope.currentPage > 0){
                        scope.currentPage -= 1;
                    }
                };

                scope.page = function(i){
                    scope.currentPage = i;
                };

                scope.next = function(){
                    if(scope.currentPage < scope.pageCount() - 1){
                        scope.currentPage += 1;
                    }
                };

                scope.pageCount = function(){
                    if(scope[targetName]){
                        return Math.ceil(scope[targetName].length / scope.pageSize);
                    }else{
                        return 0;
                    }
                };

                scope.shouldHide = function(){
                    return (scope[targetName] && scope[targetName].length <= scope.pageSize);
                };

                scope.unselectedAll = function(){
                    scope.selectedAll = false;
                };

                scope.$watch('selectedAll', function(newValue, _oldValue){
                    if(newValue != undefined){
                        scope[targetName].filter(function(target, i){
                            if(i >= scope.currentPage * scope.pageSize && i < scope.currentPage * scope.pageSize + scope.pageSize){
                                scope.selected[target.id] = newValue;
                            }
                        });
                    }
                });
            }
        };
    });