'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractStore = require('../abstracts/store');
var injector = require('../injector');
var angular = injector.angular();
var app = injector.app();
var Dispatcher = injector.NetworkDiagramDispatcher();
var egrid = injector.egrid();
var log = injector.log();
var semjs = injector.semjs();
/**
 * @class
 * @classdesc Renderer has a role equivalent to the Store by the Flux-way
 */
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    /**
     * @constructor
     */
    function Renderer() {
        _super.call(this);
        // DO NOT call #init() here because rootElement hasn't been rendered yet.
    }
    /**
     * @param {function(ev: ng.IAngularEvent, ...args: *[]): *} listener
     * @returns {{dispose: (function(): void)}}
     */
    Renderer.prototype.addListener = function (listener) {
        return _super.prototype.baseAddListener.call(this, Renderer.CHANGE, listener);
    };
    /**
     * @param {*} err
     * @returns {void}
     */
    Renderer.prototype.publish = function (err) {
        _super.prototype.basePublish.call(this, Renderer.CHANGE, err);
    };
    /**
     * @returns {void}
     */
    Renderer.prototype.init = function () {
        _super.prototype.init.call(this);
        log.trace(log.t(), __filename, '#init()');
        Dispatcher.addHandlers({
            addEgmHandlers: this.addEgmHandlers.bind(this),
            updateDiagram: this.updateDiagram.bind(this)
        });
    };
    /**
     * @param {*} e - event non-use
     * @param {EgmHandlers} handlers
     * @returns {void}
     */
    Renderer.prototype.addEgmHandlers = function (e, handlers) {
        if (!this.egm) {
            this.publish(new Error('The egm has not been initialized'));
            return;
        }
        this.egm.onClickVertex(handlers.onClickVertex).vertexButtons(handlers.vertexButtons);
    };
    /**
     * @param {*} e - event non-use
     * @param {egrid.core.Graph} graph
     * @returns {void}
     */
    Renderer.prototype.updateDiagram = function (e, graph) {
        var _this = this;
        log.trace(log.t(), __filename, '#updateDiagram()', graph);
        this.initEgm(graph);
        this.egm.size([
            angular.element('isem-main-column').width(),
            angular.element('isem-network-diagram-display').height()
        ]);
        var render = function () {
            d3.select('#isem-svg-screen').datum(graph).transition().call(_this.egm).call(_this.egm.center());
        };
        render();
        if (graph.vertices().length <= 0) {
            return;
        }
        this.calculate(graph).then(render);
    };
    /**
     * Initialize egrid.core.egm() only once
     *
     * @param {egrid.core.Graph} graph
     * @returns {void}
     */
    Renderer.prototype.initEgm = function (graph) {
        this.egm = this.egm || this.defaultEgm(graph);
    };
    /**
     * @param {egrid.core.Graph} graph
     * @returns {egrid.core.EGM}
     */
    Renderer.prototype.defaultEgm = function (graph) {
        log.trace(log.t(), __filename, '#defaultEgm()');
        var edgeTextFormat = d3.format('4.3g');
        var edgeWidthScale = d3.scale.linear().domain([0, 2]).range([1, 3]);
        var colors = {
            diagramBackground: '#ffffff',
            edgeColor1: '#71a9f7',
            edgeColor2: '#df3b57',
            latentBackground: '#f2cee0',
            observedBackground: '#e3f6fd',
            selectedStroke: '#daf984',
            stroke: '#1f1d1e'
        };
        return egrid.core.egm().dagreRankSep(50).dagreNodeSep(50).backgroundColor(colors.diagramBackground).vertexText(function (d) { return d.label; }).vertexAveilability(function (d) { return d.enabled; }).vertexColor(function (d) {
            return d.latent ? colors.latentBackground : colors.observedBackground;
        }).maxTextLength(30).strokeColor(colors.stroke).selectedStrokeColor(colors.selectedStroke).edgeColor(function (u, v) {
            return (graph.get(u, v).coefficient >= 0) ? colors.edgeColor1 : colors.edgeColor2;
        }).edgeWidth(function (u, v) {
            return edgeWidthScale(Math.abs(graph.get(u, v).coefficient));
        }).edgeText(function (u, v) {
            return edgeTextFormat(graph.get(u, v).coefficient);
        });
    };
    /**
     * @param {egrid.core.Graph} graph
     * @returns {JQueryPromise<any>}
     */
    Renderer.prototype.calculate = function (graph) {
        var _this = this;
        log.trace(log.t(), __filename, '#calculate()');
        var solver = semjs.solver();
        var variableIndices = {};
        var variableIds = {};
        var variables = graph.vertices().filter(function (u) {
            return graph.get(u).enabled;
        }).map(function (u, i) {
            variableIndices[u] = i;
            variableIds[i] = u;
            return graph.get(u);
        });
        var n = variables.length;
        if (n === 1) {
            // solver() returns an error when a length is 1.
            log.warn(log.t(), __filename, '#calculate(), variables.length === 1, aborting');
            return { then: function (cb) { return cb(); } };
        }
        if (n < 1) {
            // Occurs TypeError at semjs/src/stats/cov.coffee#L3
            // http://git.io/pIS8
            log.warn(log.t(), __filename, '#calculate(), variables.length < 1, aborting');
            return { then: function (cb) { return cb(); } };
        }
        var alpha = graph.edges().filter(function (edge) {
            return graph.get(edge[0]).enabled || graph.get(edge[1]).enabled;
        }).map(function (edge) {
            return [variableIndices[edge[0]], variableIndices[edge[1]]];
        });
        var sigma = variables.map(function (_, i) {
            return [i, i];
        });
        var S = semjs.stats.corrcoef(variables.filter(function (d) {
            return !d.latent;
        }).map(function (d) {
            return d.data;
        }));
        return solver(n, alpha, sigma, S).then(function (result) {
            log.debug(log.t(), __filename, '#calculate() solver then', result.attributes);
            result.alpha.forEach(function (path) {
                var u = variableIds[path[0]];
                var v = variableIds[path[1]];
                graph.get(u, v).coefficient = path[2];
            });
            _this.setattributeArray(result.attributes);
        });
    };
    /**
     * @param {{name: string, value: number}[]} attrs
     * @returns {void}
     */
    Renderer.prototype.setattributeArray = function (attrs) {
        this.attributeArray = attrs;
        this.publish();
    };
    /* local constant */
    Renderer.CHANGE = 'NetworkDiagramRenderer:CHANGE';
    return Renderer;
})(AbstractStore);
exports.singleton = new Renderer();
