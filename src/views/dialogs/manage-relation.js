'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var localized = injector.localized();
var log = injector.log();
var directiveName = 'isemDialogManageRelation';
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
        this.$scope.edgeArray = this.$scope.dialog.data.edgeArray;
        this.$scope.variableArray = this.$scope.dialog.data.variableArray;
        this.$scope.vertexId = this.$scope.dialog.data.vertexId;
        this.$scope.localized = localized(this.$scope.locale(), directiveName);
        this.addKeyboardHandler();
        this.generateManagedEdgeList();
    };
    /**
     * @returns {void}
     */
    Controller.prototype.addKeyboardHandler = function () {
        var _this = this;
        this.$scope.dialog.onKeyDown(function (e) {
            if (e.keyCode === 13) {
            }
            if (e.keyCode === 27) {
                _this.cancel();
            }
        });
    };
    /**
     * @returns {[number, number][]}
     */
    Controller.prototype.generateManagedEdgeList = function () {
        var _this = this;
        var filtered = (function () {
            // I do not think of a good variable name... sorry!
            var send = _this.filterRelatedEdge();
            var receive = _this.filterRelatedEdge(true);
            return send.concat(receive);
        })();
        var labels = {};
        this.$scope.variableArray.forEach(function (v) {
            labels[v.vertexId] = v.label;
        });
        this.$scope.managedEdgeList = filtered.map(function (edge) {
            return {
                uLabel: labels[edge[0]],
                u: edge[0],
                vLabel: labels[edge[1]],
                v: edge[1],
                selected: false
            };
        });
    };
    /**
     * @params {boolean} opposite
     * @returns {[number, number][]}
     */
    Controller.prototype.filterRelatedEdge = function (opposite) {
        var _this = this;
        if (opposite === void 0) { opposite = false; }
        log.trace(log.t(), __filename, '#filterRelatedEdge()', this.$scope.edgeArray, opposite);
        if (this.$scope.edgeArray == null) {
            log.info(log.t(), __filename, 'edgeArray is empty');
            return [];
        }
        var anchored = opposite ? 1 : 0;
        return this.$scope.edgeArray.filter(function (edge) {
            return _this.$scope.vertexId === edge[anchored];
        });
    };
    /**
     * @returns {void}
     */
    Controller.prototype.remove = function () {
        log.debug(log.t(), __filename, '#remove()', arguments);
        var removeTarget = this.$scope.managedEdgeList.filter(function (row) {
            return row.selected;
        });
        this.$rootScope.$broadcast(constants.REMOVE_RELATION, removeTarget);
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
        template: '<isem-dialog-manage-relation isem-io-locale="$root.locale" />',
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
            templateUrl: app.viewsDir.dialogs + 'manage-relation.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
