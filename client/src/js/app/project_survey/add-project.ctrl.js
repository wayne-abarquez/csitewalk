(function(){
'use strict';

angular.module('demoApp.survey')
    .controller('addProjectController', ['$scope', '$controller', 'modalServices', 'Projects', 'position', 'positionAddress', addProjectController]);

    function addProjectController ($scope, $controller, modalServices, Projects, position, positionAddress) {
        var vm = this;

        // Inherit all error handling methods from errorController
        $controller('errorController', {$scope: $scope});
        //$controller('validationController', {$scope: $scope});

        $scope.project = {};

        vm.initialize = initialize;
        vm.save = save;
        vm.close = close;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $scope.project.coordinates = position.toJSON();
            $scope.project.project_address = positionAddress;
        }

        function save () {
            console.log('project: ', $scope.project);

            Projects.post($scope.project)
                .then(function(response){
                    var restangularizedProject = Projects.cast(response.project);
                    // dismiss modal
                    modalServices.hideResolveModal(restangularizedProject);
                },function(errorResponse){
                    console.log('error adding project: ', errorResponse);

                    // TODO: show Errors
                    if(errorResponse.data.errors) {
                        $scope.showErrorAlerts(errorResponse.data.errors, $scope.project, 'project');
                    }
                });
        }

        function close () {
            modalServices.closeModal();
        }


        //$scope.fileChanged = function (files, rejectedFiles, model, modelName) {
        //    var deferred = $q.defer();
        //    var name_parts = modelName.split('.');
        //    var section = name_parts[name_parts.length - 2];
        //    var field = name_parts[name_parts.length - 1];
        //    var fields = {section: section, field: field};
        //    var child_name = modelName.substring(modelName.indexOf('.') + 1);
        //
        //    if (rejectedFiles && rejectedFiles.constructor == Array && rejectedFiles.length > 0) {
        //        utilServices.setScopeValue(model, child_name + "_status", "=> Only supports pdf, jpg, png, tif, docx, xlsx");
        //        deferred.reject("Unsupported file");
        //        return;
        //    }
        //
        //    if (files == null || files.constructor != Array || files.length == 0) return null;
        //    var file_name = files[0].name;
        //
        //    var successCallback = function (response) {
        //        $timeout(function () {
        //            utilServices.setScopeValue(model, child_name, response.filename);
        //            utilServices.setScopeValue(model, child_name + "_to_upload", null);
        //            utilServices.setScopeValue(model, child_name + "_status", "");
        //            // if server created a new candidate_site to save this file,
        //            // we set the id for the model here to avoid creating new entries in db.
        //            if (_.has(response, 'cs_id')) {
        //                model.id = response.cs_id;
        //            }
        //        });
        //        deferred.resolve(response);
        //    };
        //
        //    var errorCallback = function (response, statusCode) {
        //        $timeout(function () {
        //            console.log(response);
        //            if (statusCode == 413) {
        //                utilServices.setScopeValue(model, child_name + "_to_upload", null);
        //                utilServices.setScopeValue(model, child_name + "_status", "=> {0} is > 4Mb".format(file_name));
        //            } else {
        //                if ($scope.offlineMode) {
        //                    // don't set _to_upload to null as we'll be saving that offline
        //                    utilServices.setScopeValue(model, child_name + "_status", "=> {0} pending upload".format(file_name));
        //                }
        //                else {
        //                    utilServices.setScopeValue(model, child_name + "_to_upload", null);
        //                    utilServices.setScopeValue(model, child_name + "_status", "=> {0} failed to upload".format(file_name));
        //                }
        //            }
        //        });
        //        deferred.reject(response);
        //    };
        //
        //    var progressCallback = function (evt) {
        //        $timeout(function () {
        //            var progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        //            var status = "=> " + file_name + " " + progress.toString() + "%";
        //            utilServices.setScopeValue(model, child_name + "_status", status);
        //        });
        //    };
        //
        //    if (modelName.indexOf('scip.sections') == 0) {
        //        webServices.uploadSCIPFile($scope.scip.id, fields, files)
        //            .success(successCallback)
        //            .error(errorCallback)
        //            .progress(progressCallback);
        //    } else {
        //        var scipId = $scope.scip.id;
        //        var candidateId = model.id;
        //        webServices.uploadSCIPCandidateFile(scipId, candidateId, fields, files)
        //            .success(successCallback)
        //            .error(errorCallback)
        //            .progress(progressCallback);
        //    }
        //
        //    return deferred.promise;
        //};

    }
}());