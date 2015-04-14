'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var log = injector.log();
var directiveName = 'isemSubToolGroup';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($rootScope, $scope) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        // noop
    }
    /**
     * @returns {void}
     */
    Controller.prototype.toggleDisplayAll = function () {
        if (!this.$scope.variableArray()) {
            log.warn(log.t(), __filename, '#toggleDisplayAll(), variableArray() is undefined, aborting');
            return;
        }
        var enabledArray = this.$scope.variableArray().filter(function (v) {
            return v.enabled;
        });
        var ids = this.$scope.variableArray().map(function (v) {
            return v.vertexId;
        });
        if (0 < enabledArray.length) {
            this.$rootScope.$broadcast(constants.DISABLE_VERTEX_DISPLAY, ids);
            return;
        }
        this.$rootScope.$broadcast(constants.ENABLE_VERTEX_DISPLAY, ids);
    };
    return Controller;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: Controller,
            controllerAs: 'Controller',
            restrict: 'E',
            scope: {
                variableArray: '&isemIoVariableArray'
            },
            templateUrl: app.viewsDir.networkDiagram + 'sub-tool-group.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
