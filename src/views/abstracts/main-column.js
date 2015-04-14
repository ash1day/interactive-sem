'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemMainColumn';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        // Do NOT specify to the field of 'scope'
        // because of this directive is an abstract.
        return {
            restrict: 'E',
            template: ''
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
