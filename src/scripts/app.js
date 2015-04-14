/// <reference path="../../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/cw-log/cw-log.d.ts" />
/// <reference path="../../../typings/cw-modal/cw-modal.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/egrid-core/egrid-core.d.ts" />
/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/semjs/sem.d.ts" />
'use strict';
var injector = require('./injector');
var angular = injector.angular();
exports.appName = 'egrid-sem';
exports.externalModule = ['ngRoute', 'cwModal'];
// e.g. 'ja', 'en'... see src/scripts/localized
exports.defaultLocale = 'ja';
angular.module(exports.appName, exports.externalModule);
/**
 * Specify the directory path
 */
exports.viewsDir = {
    commonRoles: 'src/views/common-roles/',
    dialogs: 'src/views/dialogs/',
    directives: 'src/views/directives/',
    gui: 'src/views/gui/',
    networkDiagram: 'src/views/network-diagram/',
    screens: 'src/screens/'
};
/**
 * @constructor
 * @ngInject
 */
function RouteConfig($routeProvider, $locationProvider) {
    // <any> hack so angular.d.ts does not support arg.
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider.when('/', { template: '<isem-screen-network-diagram isem-io-locale="$root.locale"></isem-screen-network-diagram>' }).otherwise({ redirectTo: '/' });
}
/**
 * @constructor
 * @ngInject
 */
function RunCallback($rootScope) {
    $rootScope.locale = exports.defaultLocale;
}
angular.module(exports.appName).config(RouteConfig);
angular.module(exports.appName).run(RunCallback);
