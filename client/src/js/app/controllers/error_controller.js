(function(){
'use strict';

angular.module('demoApp')
    .controller('errorController', ['$scope', 'HashTable', errorController]);

    function errorController ($scope, HashTable) {
        $scope.errors = new HashTable();

        /**
         * Map of errors come in two formats:
         * 1) errors[field] = {"0":"msg1", "1":"msg2", ...}
         *  - These are errors for model data
         *      (e.g. scip.project_name, candidate.latitude)
         * 2) errors[section][field] = ["msg1", "msg2", ...]
         *  - These are errors for model sections and their fields
         *      (e.g. scip.sections.scip_info.location_name, candidate.sections.zoning_info.area_size)
         *
         * @param errors - Associative array (map) containing error messages for each fields
         * @param model  - Contains the JS Object for our DBModel
         * @param prefix - Contains the name of our parent model (e.g. "scip", "candidate")
         */
        $scope.showErrorAlerts = function (errors, model, prefix) {
            console.log('show error alerts: ', errors);
            var alerts = {};
            var numErrors = 0;

            model.errors = {};

            for (var section in errors) {
                for (var field in errors[section]) {
                    if (field !== '0') {
                        var modelName = [prefix, 'sections', section, field].join('.');
                        var error = errors[section][field];
                        alerts[modelName] = error[error.length - 1];
                        numErrors++;
                    } else {
                        var modelName = [prefix, section].join('.');
                        var error = errors[section];
                        alerts[modelName] = error[error.length - 1];
                        numErrors++;
                        break;
                    }
                }

                var errStr = '';
                errors[section].forEach(function(err){
                    errStr += err + '\n'
                });
                model.errors[section] = errStr;
            }

            $scope.errors.put(model, alerts);
            console.log('modal: ', model);
            model.numErrors = numErrors;
        };

        $scope.setErrorTooltip = function (model, modelName) {
            $scope.errorTooltip = $scope.getError(model, modelName);
        };

        $scope.putError = function (model, modelName, error) {
            var alerts = $scope.errors.get(model);
            if (!alerts) alerts = {};
            alerts[modelName] = error;
            $scope.errors.put(model, alerts);
        };

        $scope.removeError = function (model, modelName) {
            var alerts = $scope.errors.get(model);
            if (alerts && modelName in alerts) {
                delete alerts[modelName];
                $scope.errors.put(alerts);
            }
        };

        $scope.hasError = function (model, modelName) {
            var alerts = $scope.errors.get(model);
            if (alerts == undefined || alerts[modelName] == undefined)
                return false;
            return true;
        };

        $scope.getError = function (model, modelName) {
            var alerts = $scope.errors.get(model);
            if (alerts && _.has(alerts, modelName))
                return alerts[modelName];
            return undefined;
        };

    }
}());