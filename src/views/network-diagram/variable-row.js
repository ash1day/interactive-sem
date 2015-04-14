'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var directiveName = 'isemVariableRow';
/* className constants */
var VERTEX_ENABLED = 'isem-vertex-enabled';
var VERTEX_DISABLED = 'isem-vertex-disabled';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($rootScope, $scope, $element) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$element = $element;
        // noop
    }
    /**
     * @returns {typeVertex.Props}
     */
    Controller.prototype.variable = function () {
        Controller.updateClassForIcon(this.$scope.variable(), this.$element);
        return this.$scope.variable();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.toggleDisplay = function () {
        var id = this.$scope.variable().vertexId;
        this.$rootScope.$broadcast(constants.TOGGLE_VERTEX_DISPLAY, id);
    };
    /**
     * @returns {void}
     */
    Controller.updateClassForIcon = function (variable, element) {
        if (variable.enabled) {
            element.removeClass(VERTEX_DISABLED).addClass(VERTEX_ENABLED);
            return;
        }
        element.removeClass(VERTEX_ENABLED).addClass(VERTEX_DISABLED);
    };
    return Controller;
})();
var Definition = (function () {
    function Definition() {
    }
    Definition.styling = function (element) {
        element.addClass(VERTEX_ENABLED);
    };
    Definition.compile = function (tElement) {
        Definition.styling(tElement);
        return Definition.link;
    };
    Definition.link = function ($scope, iElement) {
        Controller.updateClassForIcon($scope.variable(), iElement);
    };
    Definition.ddo = function () {
        return {
            compile: Definition.compile,
            controller: Controller,
            controllerAs: 'Controller',
            restrict: 'E',
            scope: {
                variable: '&isemIoVariable'
            },
            templateUrl: app.viewsDir.networkDiagram + 'variable-row.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
