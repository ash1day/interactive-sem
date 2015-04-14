'use strict';
var injector = require('../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemScreenNetworkDiagram';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            restrict: 'E',
            scope: {
                locale: '&isemIoLocale'
            },
            templateUrl: app.viewsDir.screens + 'screen-network-diagram.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
