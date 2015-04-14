'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var directiveName = 'isemFooter';
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            restrict: 'E',
            templateUrl: app.viewsDir.commonRoles + 'footer.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
