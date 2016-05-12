(function(){
'use strict';

angular.module('demoApp')
    .controller('validationController', ['$scope', 'utilServices', validationController]);

    function validationController ($scope, utilServices) {

        //$scope.onTextChanged = function (model, modelName, value) {
        //    console.log("{0} changed value to {1}".format(modelName, value));
        //    if (modelName.endsWith(".latitude") || modelName.endsWith(".longitude")) {
        //        $scope.validateLatLng(model, modelName, value);
        //    } else if (modelName.endsWith(".lease_area_size")) {
        //        $scope.validateLeaseAreaSize(model, modelName, value);
        //    }
        //};

        $scope.validateLatLng = function (model, modelName, value) {
            var data = ("" + value).trim();
            var components = [];
            if (/^(\-*\d+\-\d+\-\d+(\.\d+)*)$/.test(data)) {
                // deg-min-secs e.g. 30-24-42
                components = data.split('-');
                // if first number is negative, shift values to left and
                // treat all components as negative (e.g. -91-51-42)
                if (components.length == 4) {
                    for (var i = 1; i < components.length; i++)
                        components[i - 1] = parseFloat(components[i]) * -1.0;
                    components.splice(components.length - 1, 1);
                }
            } else if (/^(\-*\d+\ \d+\ \d+(\.\d+)*)$/.test(data)) {
                // deg min secs e.g. 30 24 42
                components = data.split(' ');
                // if first number is negative, make all components negative
                // e.g. (-98 03 46.16)
                if (components[0].indexOf('-') >= 0) {
                    for (var i = 1; i < components.length; i++)
                        components[i] = parseFloat(components[i]) * -1.0;
                }
            }
            if (components.length == 3) {
                var degrees = parseFloat(components[0]) +
                    parseFloat(components[1]) / 60.0 + parseFloat(components[2]) / 3600.0;
                var childName = modelName.slice(modelName.indexOf('.') + 1, modelName.length);
                utilServices.setScopeValue(model, childName, degrees.toFixed(6));
                $scope.removeError(model, modelName);
            } else if (/^(\-*\d+(\.\d+)*)$/.test(data)) {
                // degrees in decimal e.g. 30.2124234
                $scope.removeError(model, modelName);
            } else {
                // invalid data format
                $scope.putError(model, modelName, "Invalid number");
            }
        };

        $scope.validateLeaseAreaSize = function (model, modelName, value) {
            var data = ("" + value).trim();
            if (/^(\d+\s*[x]\d+)$/.test(data)) {
                // number x number e.g. 30x10 is auto-converted to 300
                var components = data.split('x');
                var totalArea = parseInt(components[0].trim()) * parseInt(components[1].trim());
                utilServices.setScopeValue($scope, modelName, totalArea);
                $scope.removeError(model, modelName);
            } else if (/^(\d+)$/.test(data)) {
                $scope.removeError(model, modelName);
            } else {
                $scope.putError(model, modelName, "Invalid number");
            }
        };

    }
}());