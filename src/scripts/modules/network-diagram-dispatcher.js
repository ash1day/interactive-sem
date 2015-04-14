'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractDispatcher = require('../abstracts/dispatcher');
var injector = require('../injector');
var angular = injector.angular();
var constants = injector.constants();
var log = injector.log();
var Dispatcher = (function (_super) {
    __extends(Dispatcher, _super);
    /**
     * @constructor
     */
    function Dispatcher() {
        _super.call(this);
        // DO NOT call #init() here because rootElement hasn't been rendered yet.
    }
    /**
     * @returns {void}
     */
    Dispatcher.prototype.init = function () {
        _super.prototype.init.call(this);
    };
    /**
     * @param {*} handlers
     */
    Dispatcher.prototype.addHandlers = function (handlers) {
        log.trace(log.t(), __filename, '#addHandlers()');
        _super.prototype.on.call(this, constants.ADD_EGM_HANDLERS, handlers.addEgmHandlers);
        _super.prototype.on.call(this, constants.ADD_LATENT_VARIABLE, handlers.addVariable);
        _super.prototype.on.call(this, constants.ADD_RELATION, handlers.addRelation);
        _super.prototype.on.call(this, constants.DISABLE_VERTEX_DISPLAY, handlers.disableVertexDisplay);
        _super.prototype.on.call(this, constants.ENABLE_VERTEX_DISPLAY, handlers.enableVertexDisplay);
        _super.prototype.on.call(this, constants.IMPORT_FILE, handlers.importFile);
        _super.prototype.on.call(this, constants.REDRAW_DIAGRAM, handlers.redrawDiagram);
        _super.prototype.on.call(this, constants.REMOVE_RELATION, handlers.removeRelation);
        _super.prototype.on.call(this, constants.RENAME_VARIABLE, handlers.renameVariable);
        _super.prototype.on.call(this, constants.TOGGLE_VERTEX_DISPLAY, handlers.toggleVertexDisplay);
        _super.prototype.on.call(this, constants.UPDATE_DIAGRAM, handlers.updateDiagram);
        _super.prototype.on.call(this, constants.UPDATE_DIAGRAM, handlers.updateDiagram);
    };
    return Dispatcher;
})(AbstractDispatcher);
exports.singleton = new Dispatcher();
