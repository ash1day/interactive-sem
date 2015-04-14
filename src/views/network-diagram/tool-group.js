'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var localized = injector.localized();
var log = injector.log();
var AddLatentVariable = injector.AddLatentVariable();
var ImportFile = injector.ImportFile();
var directiveName = 'isemNetworkDiagramToolGroup';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($rootScope, $scope) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$scope.localized = localized(this.$scope.locale(), directiveName);
    }
    /**
     * @returns {void}
     */
    Controller.prototype.openAddVariable = function () {
        AddLatentVariable.open();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.openImportFile = function () {
        ImportFile.open();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.updateDiagram = function () {
        this.$rootScope.$broadcast(constants.REDRAW_DIAGRAM);
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
                locale: '&isemIoLocale',
                variableArray: '&isemIoVariableArray'
            },
            templateUrl: app.viewsDir.networkDiagram + 'tool-group.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
