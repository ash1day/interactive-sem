'use strict';
var injector = require('../../scripts/injector');
var angular = injector.angular();
var app = injector.app();
var constants = injector.constants();
var localized = injector.localized();
var directiveName = 'isemGuiNewLatentVariable';
var Controller = (function () {
    /**
     * @constructor
     * @ngInject
     */
    function Controller($rootScope, $scope) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$scope.localized = localized(this.$scope.locale(), directiveName);
    }
    /**
     * @returns {void}
     */
    Controller.prototype.newLatentVariable = function () {
        var labelArray = (function (arr) {
            if (!arr) {
                return [];
            }
            return arr.map(function (v) {
                return v.label;
            });
        })(this.$scope.variableArray());
        var defaultName = this.$scope.localized.defaultVariableName();
        var name = Controller.createNewLatentVariableName(labelArray, defaultName);
        this.$rootScope.$broadcast(constants.ADD_LATENT_VARIABLE, name);
    };
    /**
     * @param {string[]} labelArray
     * @param {string} _defaultName
     * @returns {string}
     */
    Controller.createNewLatentVariableName = function (labelArray, _defaultName) {
        function isDefault(label) {
            return label.split(' ')[0] === _defaultName;
        }
        function getSerial(label) {
            var numPart = label.split(' ').slice(1).join(' ');
            if (/\D/.test(numPart)) {
                return NaN;
            }
            return parseInt(numPart, 10);
        }
        function defaultName(n) {
            if (!n || n < 2) {
                return _defaultName;
            }
            return [_defaultName, n].join(' ');
        }
        /***** body *****/
        if (!labelArray) {
            return defaultName();
        }
        if (labelArray.length === 1 && labelArray[0] === _defaultName) {
            return defaultName(2);
        }
        var alwaysExists = labelArray.some(function (label) { return isDefault(label); });
        if (!alwaysExists) {
            return defaultName();
        }
        var next;
        var cache = [];
        labelArray.forEach(function (label) {
            if (!isDefault(label)) {
                return;
            }
            if (label === _defaultName) {
                next = 2;
                cache.forEach(function (v) {
                    next = (next === v) ? next + 1 : next;
                });
                return;
            }
            var s = getSerial(label);
            if (next === s) {
                next += 1;
                cache.forEach(function (v) {
                    next = (next === v) ? next + 1 : next;
                });
                return;
            }
            cache.push(s);
            cache.sort(function (a, b) { return a - b; });
        });
        return defaultName(next);
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
                locale: '&isemIoLocale',
                variableArray: '&isemIoVariableArray'
            },
            templateUrl: app.viewsDir.gui + 'new-latent-variable.html'
        };
    };
    return Definition;
})();
angular.module(app.appName).directive(directiveName, Definition.ddo);
