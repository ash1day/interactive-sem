'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var localized = injector.localized();
var log = injector.log();
var directiveName = 'isemDialogAddRelation';
(function (Direction) {
    Direction[Direction["xToY"] = 0] = "xToY";
    Direction[Direction["mutual"] = 1] = "mutual";
    Direction[Direction["yToX"] = 2] = "yToX";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
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
        this.$scope.direction = 0 /* xToY */;
        this.$scope.variableArray = this.$scope.dialog.data.variableArray;
        this.$scope.vertexIdX = this.$scope.dialog.data.vertexId;
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
                _this.add(_this.$scope.vertexIdX, _this.$scope.vertexIdY, _this.$scope.direction);
            }
            if (e.keyCode === 27) {
                _this.cancel();
            }
        });
    };
    /**
     * @param {*} idX - actually string or number, it needs number
     * @param {*} idY - ditto
     * @param {*} direction - actually string or number, it needs Direction
     */
    Controller.prototype.add = function (idX, idY, direction) {
        log.debug(log.t(), __filename, '#add()', arguments);
        var data = {
            idX: parseInt(idX, 10),
            idY: parseInt(idY, 10),
            direction: parseInt(direction, 10)
        };
        if (Object.keys(Direction).indexOf(String(data.direction)) === -1) {
            log.error(log.t(), __filename, 'The value "direction" is an invalid value', data.direction);
            return;
        }
        this.$rootScope.$broadcast(constants.ADD_RELATION, data);
    };
    /**
     * This is alias of #close()
     *
     * @returns {void}
     */
    Controller.prototype.cancel = function () {
        log.trace(log.t(), __filename, '#cancel()');
        this.close();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.close = function () {
        log.trace(log.t(), __filename, '#close()');
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
        template: '<isem-dialog-add-relation isem-io-locale="$root.locale" />',
        width: 600
    });
    dialog.open(data);
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
            templateUrl: app.viewsDir.dialogs + 'add-relation.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
