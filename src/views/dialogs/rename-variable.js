'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var localized = injector.localized();
var log = injector.log();
var directiveName = 'isemDialogRenameVariable';
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
        this.$scope.variableName = this.$scope.dialog.data.variableName;
        this.$scope.vertexId = this.$scope.dialog.data.vertexId;
        this.$scope.localized = localized(this.$scope.locale(), directiveName);
        this.addKeyboardHandler();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.addKeyboardHandler = function () {
        var _this = this;
        this.$scope.dialog.onKeyDown(function (e) {
            if (e.keyCode === 13) {
                _this.rename(_this.$scope.vertexId, _this.$scope.variableName);
            }
            if (e.keyCode === 27) {
                _this.cancel();
            }
        });
    };
    /**
     * @param {string} u
     * @param {string} label
     * @returns {void}
     */
    Controller.prototype.rename = function (u, label) {
        log.trace(log.t(), __filename, '#rename()');
        var data = {
            u: u,
            label: label
        };
        this.$rootScope.$broadcast(constants.RENAME_VARIABLE, data);
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
function open(data) {
    log.debug(log.t(), __filename, 'open()', arguments);
    var rootElement = angular.element('.ng-scope').eq(0);
    var Dialog = rootElement.injector().get('Dialog');
    var dialog = new Dialog({
        template: '<isem-dialog-rename-variable isem-io-locale="$root.locale" />',
        width: 600
    });
    dialog.open(data);
}
exports.open = open;
var Definition = (function () {
    function Definition() {
    }
    Definition.link = function ($scope, iElement, __, controllers) {
        var cwModal = controllers[0];
        var self = controllers[1];
        $scope.dialog = cwModal.dialog;
        self.init();
        iElement.find('input:visible').eq(0).focus();
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
            templateUrl: app.viewsDir.dialogs + 'rename-variable.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
