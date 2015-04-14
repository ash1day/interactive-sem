'use strict';
var injector = require('../injector');
var angular = injector.angular();
var AbstractStore = (function () {
    /**
     * @constructor
     */
    function AbstractStore() {
        // DO NOT call #init() here because rootElement hasn't been rendered yet.
        // noop
    }
    /**
     * @returns {void}
     */
    AbstractStore.prototype.init = function () {
        var rootElement = angular.element('.ng-scope').eq(0);
        this.$rootScope = rootElement.scope();
    };
    /**
     * For capsulize event name to other components
     *
     * @param   {Function} listener
     * @param   {string}   name
     * @returns {{dispose: (function(): void)}}
     */
    AbstractStore.prototype.baseAddListener = function (name, listener) {
        if (!this.$rootScope) {
            this.init();
        }
        var dispose = this.$rootScope.$on(name, listener);
        return {
            dispose: dispose
        };
    };
    /**
     * @param {string} name
     * @param {*}      err
     * @param {*}      args
     * @returns {void}
     */
    AbstractStore.prototype.basePublish = function (name, err) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var broadcastArgs = [name, err].concat(args);
        this.$rootScope.$broadcast.apply(this.$rootScope, broadcastArgs);
    };
    return AbstractStore;
})();
module.exports = AbstractStore;
