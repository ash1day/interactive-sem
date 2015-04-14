'use strict';
var CsvToEgridConverter = (function () {
    function CsvToEgridConverter() {
    }
    /**
     * @params {Array} data
     * @returns {Object}
     */
    CsvToEgridConverter.convert = function (data) {
        var singleData = data[0];
        var labels = CsvToEgridConverter.makeLabels(singleData);
        var dataArray = CsvToEgridConverter.makeDataArray(data, labels);
        return { labels: labels, dataArray: dataArray };
    };
    /**
     * @param {Object} data
     * @returns {string[]}
     */
    CsvToEgridConverter.makeLabels = function (data) {
        var labels = [];
        var v;
        for (v in data) {
            if (data.hasOwnProperty(v)) {
                labels.push(v);
            }
        }
        return labels;
    };
    /**
     * @param {*} data
     * @param {string[]} labels
     * @returns {number[][]}
     */
    CsvToEgridConverter.makeDataArray = function (data, labels) {
        var x = labels.map(function (key) {
            return data.map(function (d) {
                return parseFloat(d[key]);
            });
        });
        return x;
    };
    return CsvToEgridConverter;
})();
module.exports.convert = CsvToEgridConverter.convert;
