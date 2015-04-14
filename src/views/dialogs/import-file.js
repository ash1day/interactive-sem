'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var d3 = injector.d3();
var document = injector.document();
var FileReader = injector.FileReader();
var localized = injector.localized();
var log = injector.log();
var directiveName = 'isemDialogImportFile';
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
        this.$scope.encoding = 'utf-8';
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
                _this.importFile();
            }
            if (e.keyCode === 27) {
                _this.cancel();
            }
        });
    };
    /**
     * @returns {void}
     */
    Controller.prototype.importFile = function () {
        log.trace(log.t(), __filename, '#importFile()');
        var reader = new FileReader();
        reader.onload = this.fileReaderOnLoad();
        var file = document.getElementById('file-input').files[0];
        reader.readAsText(file, this.$scope.encoding);
        this.$scope.dialog.close();
    };
    /**
     * This when used to load a file is extracted for testable.
     *
     * @returns {Function}
     */
    Controller.prototype.fileReaderOnLoad = function () {
        var _this = this;
        return function (e) {
            var data = d3.csv.parse(e.target.result);
            _this.$rootScope.$broadcast(constants.IMPORT_FILE, data);
        };
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
        template: '<isem-dialog-import-file isem-io-locale="$root.locale" />',
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
            templateUrl: app.viewsDir.dialogs + 'import-file.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
