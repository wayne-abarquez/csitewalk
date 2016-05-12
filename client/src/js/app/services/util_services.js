(function(){
'use strict';

angular.module('demoApp')
    .factory('utilServices', [utilServices]);

    function utilServices () {
        var service = {};

        var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

        service.getFormData = getFormData;
        service.setScopeValue = setScopeValue;
        service.byteToHex = byteToHex;

        /**
         * Formats the results of $(form).serializeArray() from
         * [{name:"", value:""},{}...] into {name1:value1, name2:value2, ...}
         * @param form
         * @returns {{}}
         */
        function getFormData(form) {
            var unindexed_array = form.serializeArray();
            var indexed_array = {};

            _.map(unindexed_array, function (n, i) {
                indexed_array[n['name']] = n['value'];
            });

            return indexed_array;
        }

        /**
         * Iteratively finds a model inside a scope and sets its value.
         * E.g. setScopeValue($scope, 'scip.sections.scip_files.file_usgs_topo_map', 1)
         * @param $scope
         * @param model_name
         * @param value
         */
        function setScopeValue($scope, model_name, value) {
            var names = model_name.split('.');
            var data = $scope;
            var name = "";
            for (var i = 0; i < names.length; i++) {
                name = names[i];
                if (_.has(data, name)) {
                    if (i < names.length - 1)
                        data = data[name];
                    else
                        data[name] = value;
                } else {
                    if (i < names.length - 1)
                        break;
                    else
                        data[name] = value;
                }
            }
        }

        /**
         * 0-255 to 00-ff
         * @param b
         */
        function byteToHex(b) {
            return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
        }

        return service;
    }
}());