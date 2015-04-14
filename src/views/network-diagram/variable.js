'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemVariable';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            restrict: 'E',
            scope: {
                variableArray: '&isemIoVariableArray'
            },
            templateUrl: app.viewsDir.networkDiagram + 'variable.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
