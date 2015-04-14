'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemNetworkDiagramMainColumn';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            restrict: 'A',
            scope: {
                attributeArray: '&isemIoAttributeArray',
                locale: '&isemIoLocale',
                variableArray: '&isemIoVariableArray'
            },
            templateUrl: app.viewsDir.networkDiagram + 'main-column.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
