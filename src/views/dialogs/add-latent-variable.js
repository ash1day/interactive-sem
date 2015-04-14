'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var localized = injector.localized();
var log = injector.log();
var directiveName = 'isemDialogAddLatentVariable';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($rootScope, $scope) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        // DO NOT call #init() here because $scope hasn't been set yet.
    }
    Controller.prototype.init = function () {
        log.trace(log.t(), __filename, '#init()', this.$scope);
        this.addKeyboardHandler();
        this.$scope.localized = localized(this.$scope.locale(), directiveName);
    };
    /**
     * @returns {void}
     */
    Controller.prototype.addKeyboardHandler = function () {
        var _this = this;
        this.$scope.dialog.onKeyDown(function (e) {
            if (e.keyCode === 13) {
                _this.add(_this.$scope.variableName);
            }
            if (e.keyCode === 27) {
                _this.cancel();
            }
        });
    };
    /**
     * @param {string} v - variable
     * @returns {void}
     */
    Controller.prototype.add = function (v) {
        log.trace(log.t(), __filename, '#add()');
        this.$rootScope.$broadcast(constants.ADD_LATENT_VARIABLE, v);
        this.$scope.dialog.close();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.cancel = function () {
        log.trace(log.t(), __filename, '#cancel()');
        this.$scope.dialog.close();
    };
    return Controller;
})();
exports.Controller = Controller;
function open() {
    log.trace(log.t(), __filename, 'open()');
    var rootElement = angular.element('.ng-scope').eq(0);
    var Dialog = rootElement.injector().get('Dialog');
    var dialog = new Dialog({
        template: '<isem-dialog-add-latent-variable isem-io-locale="$root.locale" />',
        width: 600
    });
    dialog.open();
}
exports.open = open;
var Definition = (function () {
    function Definition() {
    }
    Definition.link = function ($scope, _, __, controllers) {
        var cwModal = controllers[0];
        var self = controllers[1];
        $scope.dialog = cwModal.dialog;
        self.init();
    };
    Definition.ddo = function () {
        return {
            controller: Controller,
            controllerAs: 'Controller',
            link: Definition.link,
            require: ['^cwModal', directiveName],
            restrict: 'E',
            scope: {
                locale: '&isemIoLocale'
            },
            templateUrl: app.viewsDir.dialogs + 'add-latent-variable.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
