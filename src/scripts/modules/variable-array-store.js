'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AddRelation = require('../../views/dialogs/add-relation');
var Direction = AddRelation.Direction;
var AbstractStore = require('../abstracts/store');
var injector = require('../injector');
var angular = injector.angular();
var app = injector.app();
var egrid = injector.egrid();
var log = injector.log();
var Converter = injector.CsvToEgridConverter();
var Dispatcher = injector.NetworkDiagramDispatcher();
var Vertex = injector.Vertex();
var Store = (function (_super) {
    __extends(Store, _super);
    /**
     * @constructor
     */
    function Store() {
        _super.call(this);
        // DO NOT call #init() here because rootElement hasn't been rendered yet.
    }
    /**
     * @param {function(ev: ng.IAngularEvent, ...args: *[]): *} listener
     * @returns {{dispose: (function(): void)}}
     */
    Store.prototype.addListener = function (listener) {
        return _super.prototype.baseAddListener.call(this, Store.CHANGE, listener);
    };
    /**
     * @param {*} err
     * @returns {void}
     */
    Store.prototype.publish = function (err) {
        _super.prototype.basePublish.call(this, Store.CHANGE, err);
    };
    /**
     * @returns {void}
     */
    Store.prototype.init = function () {
        _super.prototype.init.call(this);
        log.trace(log.t(), __filename, '#init()');
        this.graph = egrid.core.graph.adjacencyList();
        Dispatcher.addHandlers({
            addRelation: this.addRelation.bind(this),
            addVariable: this.addVariable.bind(this),
            disableVertexDisplay: this.disableVertexDisplay.bind(this),
            enableVertexDisplay: this.enableVertexDisplay.bind(this),
            importFile: this.importFile.bind(this),
            redrawDiagram: this.redrawDiagram.bind(this),
            removeRelation: this.removeRelation.bind(this),
            renameVariable: this.renameVariable.bind(this),
            toggleVertexDisplay: this.toggleVertexDisplay.bind(this)
        });
    };
    /**
     * @param {*} _ - event non-use
     * @param {{direction: Direction, idX: number, idY: number}} data
     * @returns {void}
     */
    Store.prototype.addRelation = function (_, data) {
        log.debug(log.t(), __filename, '#addRelation()', data);
        var x = data.idX;
        var y = data.idY;
        if (data.direction === 0 /* xToY */) {
            this.graph.addEdge(x, y);
        }
        else if (data.direction === 1 /* mutual */) {
            this.graph.addEdge(x, y);
            this.graph.addEdge(y, x);
        }
        else if (data.direction === 2 /* yToX */) {
            this.graph.addEdge(y, x);
        }
        this.updateStore();
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {string} label
     * @returns {void}
     */
    Store.prototype.addVariable = function (_, label) {
        log.trace(log.t(), __filename, '#addVariable()');
        Vertex.addLatentVariable(this.graph, label);
        this.updateStore();
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {Array<{string: string}>} importedFile
     * @returns {void}
     */
    Store.prototype.importFile = function (_, importedFile) {
        log.trace(log.t(), __filename, '#importFile()');
        try {
            var result = Converter.convert(importedFile);
        }
        catch (e) {
            return this.publish(e);
        }
        if (!result) {
            return this.publish(new Error('There is no converted result from the imported file'));
        }
        this.replaceAllVertex(result);
        this.publish();
    };
    /**
     * @returns {void}
     */
    Store.prototype.redrawDiagram = function () {
        log.trace(log.t(), __filename, '#redrawDiagram()');
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {Array<{u: number, v: number}>} removeTarget
     * @returns {void}
     */
    Store.prototype.removeRelation = function (_, removeTarget) {
        var _this = this;
        log.debug(log.t(), __filename, '#removeRelation()', removeTarget);
        removeTarget.forEach(function (target) {
            _this.graph.removeEdge(target.u, target.v);
        });
        this.updateStore();
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {{u: number, label: string}} data
     * @returns {void}
     */
    Store.prototype.renameVariable = function (_, data) {
        log.debug(log.t(), __filename, '#renameVariable()', data);
        Vertex.renameVariable(this.graph, data.u, data.label);
        this.updateStore();
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {number|number[]} vertexId - id or ids
     * @returns {void}
     */
    Store.prototype.disableVertexDisplay = function (_, vertexId) {
        log.trace(log.t(), __filename, '#disableVertexDisplay()', vertexId);
        this.setEnabledToMultipleVertices(vertexId, false);
        this.updateStore();
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {number|number[]} vertexId - id or ids
     * @returns {void}
     */
    Store.prototype.enableVertexDisplay = function (_, vertexId) {
        log.trace(log.t(), __filename, '#enableVertexDisplay()', vertexId);
        this.setEnabledToMultipleVertices(vertexId, true);
        this.updateStore();
        this.publish();
    };
    /**
     * @param {*} _ - event non-use
     * @param {number} vertexId
     * @returns {void}
     */
    Store.prototype.toggleVertexDisplay = function (_, u) {
        log.trace(log.t(), __filename, '#toggleVertexDisplay()', u);
        Vertex.toggleEnabled(this.graph, u);
        this.updateStore();
        this.publish();
    };
    /**
     * @param {number|number[]} vertexId - id or ids
     * @param {boolean}  state
     */
    Store.prototype.setEnabledToMultipleVertices = function (vertexId, state) {
        var _this = this;
        var ids = (Array.isArray(vertexId)) ? vertexId : [vertexId];
        ids.forEach(function (u) { return Vertex.setEnabled(_this.graph, u, state); });
    };
    /**
     * @returns {void}
     */
    Store.prototype.updateStore = function () {
        this.updateVariableArray();
        this.updateEdgeArray();
    };
    /**
     * Update variable array by replace from graph.vertices().map()
     *
     * @returns {void}
     */
    Store.prototype.updateVariableArray = function () {
        var _this = this;
        this.variableArray = this.graph.vertices().map(function (u) {
            var vertex = _this.graph.get(u);
            vertex.vertexId = u;
            return vertex;
        });
    };
    /**
     * @returns {void}
     */
    Store.prototype.updateEdgeArray = function () {
        this.edgeArray = this.graph.edges();
    };
    /**
     * @returns {void}
     */
    Store.prototype.replaceAllVertex = function (result) {
        var _this = this;
        this.removeAllVertex();
        result.labels.forEach(function (label, i) {
            return Vertex.addObservedVariable(_this.graph, label, result.dataArray[i]);
        });
        this.updateStore();
    };
    /**
     * Remove all vertex.
     * clearVertex() means remove edge from the in and out itself.
     * then remove each.
     *
     * @returns {void}
     */
    Store.prototype.removeAllVertex = function () {
        var _this = this;
        log.trace(log.t(), __filename, '#removeAllVertex()');
        this.graph.vertices().forEach(function (u) {
            _this.graph.clearVertex(u);
            _this.graph.removeVertex(u);
        });
    };
    /* local constant */
    Store.CHANGE = 'VariableArrayStore:CHANGE';
    return Store;
})(AbstractStore);
exports.singleton = new Store();
