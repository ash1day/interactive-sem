'use strict';
var injector = require('../injector');
var angular = injector.angular();
var AbstractDispatcher = (function () {
    /**
     * @constructor
     */
    function AbstractDispatcher() {
        // DO NOT call #init() here because rootElement hasn't been rendered yet.
        // noop
    }
    /**
     * @returns {void}
     */
    AbstractDispatcher.prototype.init = function () {
        var rootElement = angular.element('.ng-scope').eq(0);
        this.$rootScope = rootElement.scope();
    };
    /**
     * @param {string}   name
     * @param {Function} listener
     * @returns {void}
     */
    AbstractDispatcher.prototype.on = function (name, listener) {
        if (!listener) {
            return;
        }
        if (!this.$rootScope) {
            this.init();
        }
        this.disposer = this.disposer || {};
        if (this.disposer[name]) {
            this.disposer[name]();
        }
        this.disposer[name] = this.$rootScope.$on(name, listener);
    };
    return AbstractDispatcher;
})();
module.exports = AbstractDispatcher;
