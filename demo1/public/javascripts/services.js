/**
 * Created by vlen on 2015/10/26.
 */
var pollServices= angular.module('pollServices', ['ngResource']).
    factory('Poll', function($resource) {
        return $resource('polls/:pollId', {}, {
            // Use this method for getting a list of polls
            query: { method: 'GET', params: { pollId: 'polls' }, isArray: true }
        })
    }).
    factory('socket', function($rootScope) {
        var socket = io.connect();
        return {
            //添加事件
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    console.log(arguments);
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            //触发事件
            emit: function (eventName, data, callback) {
                console.log(eventName);
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });

pollServices.controller('PollListCtrl',PollListCtrl);
pollServices.controller('PollItemCtrl',PollItemCtrl);
pollServices.controller('PollNewCtrl',PollNewCtrl);