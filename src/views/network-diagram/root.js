'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var log = injector.log();
var Promise = injector.Promise();
/* stores */
var Renderer = injector.NetworkDiagramRenderer();
var Store = injector.VariableArrayStore();
/* dialogs */
var AddRelation = injector.AddRelation();
var ManageRelation = injector.ManageRelation();
var RenameVariable = injector.RenameVariable();
var directiveName = 'isemNetworkDiagram';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($rootScope, $scope, $timeout) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$timeout = $timeout;
        log.trace(log.t(), __filename, 'constructor');
        this.subscribe();
    }
    /**
     * @returns {void}
     */
    Controller.prototype.subscribe = function () {
        log.trace(log.t(), __filename, '#subscribe()');
        this.disposer = this.disposer || {};
        this.disposer.store = Store.addListener(this.storeChangeHandler.bind(this));
        this.disposer.renderer = Renderer.addListener(this.rendererChangeHandler.bind(this));
    };
    /**
     * @param {*} _ - event non-use
     * @param {*} err - error
     * @returns {ng.IPromise<any>}
     */
    Controller.prototype.storeChangeHandler = function (_, err) {
        var _this = this;
        log.trace(log.t(), __filename, '#storeChangeHandler()');
        if (err) {
            log.error(log.t(), __filename, err.message);
            return { then: function (cb) { return cb(); } };
        }
        return new Promise(function (done) {
            // This requires $timeout because needs forced to $apply
            _this.$timeout(function () {
                _this.$scope.variableArray = Store.variableArray;
                _this.$scope.edgeArray = Store.edgeArray;
                _this.$rootScope.$broadcast(constants.UPDATE_DIAGRAM, Store.graph);
                _this.$rootScope.$broadcast(constants.ADD_EGM_HANDLERS, _this.egmHandlers());
                done();
            }, 0);
        });
    };
    /**
     * @param {*} e - event non-use
     * @param {*} err - error
     * @returns {ng.IPromise<any>}
     */
    Controller.prototype.rendererChangeHandler = function (e, err) {
        var _this = this;
        log.trace(log.t(), __filename, '#rendererChangeHandler()');
        if (err) {
            log.error(log.t(), __filename, err.message);
            return { then: function (cb) { return cb(); } };
        }
        return new Promise(function (done) {
            // This requires $timeout because needs forced to $apply
            _this.$timeout(function () {
                _this.$scope.attributeArray = Renderer.attributeArray;
                done();
            }, 0);
        });
    };
    /**
     * @returns {Renderer.EgmHandlers}
     */
    Controller.prototype.egmHandlers = function () {
        var iconRoot = './src/resources/';
        var vertexButtons = [
            {
                icon: iconRoot + 'button-manage-relation.png',
                onClick: this.manageRelationButtonHandler.bind(this)
            },
            {
                icon: iconRoot + 'button-add-relation.png',
                onClick: this.addRelationButtonHandler.bind(this)
            },
            {
                icon: iconRoot + 'button-rename-variable.png',
                onClick: this.renameVariableButtonHandler.bind(this)
            }
        ];
        return {
            onClickVertex: this.clickVertexHandler.bind(this),
            vertexButtons: vertexButtons
        };
    };
    /**
     * @param {Vertex.Props} d
     * @param {number} vertexId
     * @returns {void}
     */
    Controller.prototype.addRelationButtonHandler = function (d, vertexId) {
        log.trace(log.t(), __filename, '#addRelationButtonHandler()', vertexId);
        var data = {
            vertexId: vertexId,
            variableArray: this.$scope.variableArray
        };
        AddRelation.open(data);
    };
    /**
     * @param {Vertex.Props} d
     * @param {number} vertexId
     * @returns {void}
     */
    Controller.prototype.manageRelationButtonHandler = function (d, vertexId) {
        log.trace(log.t(), __filename, '#manageRelationButtonHandler()', vertexId);
        var data = {
            vertexId: vertexId,
            variableArray: this.$scope.variableArray,
            edgeArray: this.$scope.edgeArray
        };
        ManageRelation.open(data);
    };
    /**
     * @param {Vertex.Props} d
     * @param {number} vertexId
     * @returns {void}
     */
    Controller.prototype.renameVariableButtonHandler = function (d, vertexId) {
        log.trace(log.t(), __filename, '#renameVariableButtonHandler()', vertexId);
        var data = {
            vertexId: vertexId,
            variableName: d.label
        };
        RenameVariable.open(data);
    };
    /**
     * @returns {void}
     */
    Controller.prototype.clickVertexHandler = function (d, vertexId) {
        log.trace(log.t(), __filename, '#clickVertexHandler()', vertexId);
        // noop
    };
    return Controller;
})();
exports.Controller = Controller;
var Definition = (function () {
    function Definition() {
    }
    Definition.ddo = function () {
        return {
            controller: Controller,
            controllerAs: 'Controller',
            restrict: 'E',
            scope: {
                locale: '&isemIoLocale'
            },
            templateUrl: app.viewsDir.networkDiagram + 'root.html'
        };
    };
    return Definition;
})();
exports.Definition = Definition;
angular.module(app.appName).directive(directiveName, Definition.ddo);
