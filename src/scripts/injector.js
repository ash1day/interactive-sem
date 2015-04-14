'use strict';
/**
 * Injector is the class that injects libraries
 * This will be stubbed when do tests
 *
 * Implemented as a static in the class
 * because of define the same name as a global defined
 * (e.g. document, FileReader)
 */
var Injector = (function () {
    function Injector() {
    }
    /* for browser */
    Injector.angular = function () {
        var angular = require('angular');
        require('angular-route');
        require('cw-modal');
        return angular;
    };
    Injector.d3 = function () {
        return require('d3');
    };
    Injector.document = function () {
        return document;
    };
    Injector.egrid = function () {
        // Should be wrapped in the property of core.
        return { core: require('egrid-core') };
    };
    Injector.FileReader = function () {
        return FileReader;
    };
    Injector.log = function () {
        return require('cw-log').logger(4);
    };
    Injector.Promise = function () {
        return Injector.angular().injector(['ng']).get('$q');
    };
    Injector.semjs = function () {
        return require('semjs');
    };
    /* for isem */
    Injector.app = function () {
        return require('./app');
    };
    Injector.constants = function () {
        return require('./constants');
    };
    Injector.localized = function () {
        return function (locale, directiveName) {
            var localized = {};
            switch (locale) {
                case 'en':
                    localized = require('./localized/en')[directiveName];
                    break;
                case 'ja':
                    localized = require('./localized/ja')[directiveName];
                    break;
            }
            return localized;
        };
    };
    /* modules */
    Injector.CsvToEgridConverter = function () {
        return require('./modules/csv-to-egrid-converter');
    };
    Injector.NetworkDiagramDispatcher = function () {
        return require('./modules/network-diagram-dispatcher').singleton;
    };
    Injector.NetworkDiagramRenderer = function () {
        return require('./modules/network-diagram-renderer').singleton;
    };
    Injector.VariableArrayStore = function () {
        return require('./modules/variable-array-store').singleton;
    };
    Injector.Vertex = function () {
        return require('./modules/vertex');
    };
    /* views */
    Injector.AddLatentVariable = function () {
        return require('../views/dialogs/add-latent-variable');
    };
    Injector.AddRelation = function () {
        return require('../views/dialogs/add-relation');
    };
    Injector.ImportFile = function () {
        return require('../views/dialogs/import-file');
    };
    Injector.ManageRelation = function () {
        return require('../views/dialogs/manage-relation');
    };
    Injector.RenameVariable = function () {
        return require('../views/dialogs/rename-variable');
    };
    return Injector;
})();
module.exports = Injector;
