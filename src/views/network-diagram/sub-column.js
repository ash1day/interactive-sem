'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemNetworkDiagramSubColumn';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            restrict: 'A',
            scope: {
                variableArray: '&isemIoVariableArray'
            },
            templateUrl: app.viewsDir.networkDiagram + 'sub-column.html',
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
