'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var localized = injector.localized();
var directiveName = 'isemHeader';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($scope) {
        this.$scope = $scope;
        this.$scope.localized = localized(this.$scope.locale(), directiveName);
    }
    return Controller;
})();
exports.Controller = Controller;
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: Controller,
            controllerAs: 'Controller',
            restrict: 'E',
            scope: {
                locale: '&isemIoLocale'
            },
            templateUrl: app.viewsDir.commonRoles + 'header.html',
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
