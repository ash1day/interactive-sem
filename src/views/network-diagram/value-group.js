'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemNetworkDiagramValueGroup';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            restrict: 'E',
            scope: {
                attributeArray: '&isemIoAttributeArray',
                locale: '&isemIoLocale'
            },
            templateUrl: app.viewsDir.networkDiagram + 'value-group.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
