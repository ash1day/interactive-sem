'use strict';
var Vertex = (function () {
    /**
     * @constructor
     * @param {egrid.core.Graph} adjacencyList
     * @param {string}           label
     * @param {boolean}          latent
     * @param {number[]}         [data]
     */
    function Vertex(adjacencyList, label, latent, data) {
        this.label = label;
        this.latent = latent;
        this.enabled = true;
        this.data = data || void 0;
        // deepCopy() removes unnecessary prototype props
        adjacencyList.addVertex(Vertex.deepCopy(this));
    }
    /**
     * @param {Object} o
     * @returns {*}
     */
    Vertex.deepCopy = function (o) {
        var copy = o;
        var k;
        if (o && typeof o === 'object') {
            copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
            for (k in o) {
                copy[k] = Vertex.deepCopy(o[k]);
            }
        }
        return copy;
    };
    return Vertex;
})();
/**
 * @param   {egrid.core.Graph} adjacencyList
 * @param   {string}   label
 * @param   {number[]} data
 * @returns {Vertex}
 */
function addObservedVariable(adjacencyList, label, data) {
    return new Vertex(adjacencyList, label, false, data);
}
exports.addObservedVariable = addObservedVariable;
/**
 * @param   {egrid.core.Graph} adjacencyList
 * @param   {string} label
 * @returns {Vertex}
 */
function addLatentVariable(adjacencyList, label) {
    return new Vertex(adjacencyList, label, true);
}
exports.addLatentVariable = addLatentVariable;
/**
 * @param   {egrid.core.Graph} adjacencyList
 * @param   {number} u
 * @param   {string} newLabel
 * @returns {void}
 */
function renameVariable(adjacencyList, u, newLabel) {
    var vertex = adjacencyList.get(u);
    vertex.label = newLabel;
    adjacencyList.set(u, vertex);
}
exports.renameVariable = renameVariable;
/**
 * @param   {egrid.core.Graph} adjacencyList
 * @param   {number}  u
 * @param   {boolean} state
 * @returns {void}
 */
function setEnabled(adjacencyList, u, state) {
    var vertex = adjacencyList.get(u);
    vertex.enabled = state;
    adjacencyList.set(u, vertex);
}
exports.setEnabled = setEnabled;
/**
 * @param   {egrid.core.Graph} adjacencyList
 * @param   {number} u
 * @returns {void}
 */
function toggleEnabled(adjacencyList, u) {
    var vertex = adjacencyList.get(u);
    setEnabled(adjacencyList, u, !vertex.enabled);
}
exports.toggleEnabled = toggleEnabled;
