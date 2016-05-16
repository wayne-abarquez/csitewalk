(function(){
'use strict';

angular.module('demoApp.survey')
    .controller('projectDetailsController', ['project', '$scope', '$q', '$timeout', '$controller', 'modalServices', 'utilServices', 'fileUploaderServices', 'UPLOAD_URL', 'locationServices', 'photoGmapServices', projectDetailsController]);

    function projectDetailsController (project, $scope, $q, $timeout, $controller, modalServices, utilServices, fileUploaderServices, UPLOAD_URL, locationServices, photoGmapServices) {
        $controller('errorController', {$scope: $scope});

        $scope.project = {
            id: 0
        };

        $scope.currentImage = {
          url: '',
          filename: ''
        };

        $scope.initialize = initialize;
        $scope.save = save;
        $scope.close = close;

        $scope.uploadFile = uploadFile;
        $scope.previewFile = previewFile;

        $scope.initialize();

        function initialize () {
            // merge response.section_files to sections files section
            console.log('get proj detail: ', project);


            //console.log('selectedProject: ',project);
            // Fixes bug on WTForms SelectField
            if(project.project_manager) project.project_manager.id = String(project.project_manager.id);
            if(project.contractor) project.contractor.id = String(project.contractor.id);
            if(project.civicsolar_account_manager) project.civicsolar_account_manager.id = String(project.civicsolar_account_manager.id);

            $scope.project = project;

            $scope.$on('$destroy', function(){
               photoGmapServices.map = null;
            });
        }


        function saveSections () {
            // Get all <form> elements under id='project-detail-content'
            var forms = $("#project-detail-content form");
            var projectData = {};
            var formData = {};
            for (var i = 0; i < forms.length; i++) {
                var disabledFields = $(forms[i]).find(':input:disabled').removeAttr('disabled');
                var data = utilServices.getFormData($(forms[i]));
                if (forms[i].name == "project_info") {
                    projectData = data;
                }
                else
                    formData[forms[i].name] = data;

                disabledFields.attr('disabled', 'disabled');
            }
            projectData["sections"] = formData;

            var dfd = $q.defer();

            console.log('projectData: ', projectData);

            $scope.project.customPOST(projectData, 'sections') //($scope.project.id, projectData)
                .then(function (response) {
                    $scope.project.date_modified = response.date_modified;
                    dfd.resolve(response);
                },function (response) {
                    dfd.reject(response);
                });
            return dfd.promise;
        }


        function postToServer() {
            var dfd = $q.defer();

            // This is a chained save sequence.
            // We'll be saving SCIPSections first.
            // Failure on any of the requests will break the sequence and halt saving.
            var onFail = function (response, model, prefix) {
                console.log(response);
                if (response && response.errors) {
                    $scope.showErrorAlerts(response.errors, model, prefix);
                }
                else
                    console.log(response);
                dfd.reject(response);
            };
            var onComplete = function (response) {
                console.log(response);
                dfd.resolve(response);
            };

            $scope.errors.clear();
            $scope.project.numErrors = 0;

            saveSections()
                .then(function (response) {
                    return onComplete(response);
                }, function (response) {
                    onFail(response, $scope.project, 'project');
                });

            return dfd.promise;
        }

        function save () {
            // Todo: show loading animation

            postToServer()
                .then(function(response){
                    // resolve dismiss modal
                    modalServices.hideResolveModal(response);
                },function(errorResponse){
                    // TODO: show Errors
                })
                .finally(function(){
                    // TODO: hide loading animation
                });
        }

        function close() {
            modalServices.closeModal();
        }

        function uploadFile (file, errorFiles, model, modelName) {
            var child_name = modelName.substring(modelName.indexOf('.') + 1);

            if (errorFiles && errorFiles.constructor == Array && errorFiles.length > 0) {
                utilServices.setScopeValue(model, child_name + "_status", "=> Only supports pdf, jpg, png, tif, docx, xlsx");
                alert("Unsupported file");
                return;
            }

            var file_name = file.name;

            var successCallback = function (response) {
                $timeout(function () {
                    utilServices.setScopeValue(model, child_name, response);
                    utilServices.setScopeValue(model, child_name + "_to_upload", null);
                    utilServices.setScopeValue(model, child_name + "_status", "");
                });
            };

            var errorCallback = function (response, statusCode) {
                $timeout(function () {
                    console.log(response);
                    if (statusCode == 413) {
                        utilServices.setScopeValue(model, child_name + "_to_upload", null);
                        utilServices.setScopeValue(model, child_name + "_status", "=> {0} is > 4Mb".format(file_name));
                    } else {
                        utilServices.setScopeValue(model, child_name + "_to_upload", null);
                        utilServices.setScopeValue(model, child_name + "_status", "=> {0} failed to upload".format(file_name));
                    }
                });
            };

            var progressCallback = function (evt) {
                $timeout(function () {
                    var progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    var status = "=> " + file_name + " " + progress.toString() + "%";
                    utilServices.setScopeValue(model, child_name + "_status", status);
                });
            };

            // todo insert flag here to check photo or file
            // if photo get the current location and heading
            // where the photo was taken
            locationServices.getCurrentLocation()
                .then(function(response){
                    var position = {'lat': response.coords.latitude, 'lng': response.coords.longitude};
                    var heading = response.coords.heading;

                    fileUploaderServices.uploadProjectFile(model, file, modelName, position, heading)
                        .success(successCallback)
                        .error(errorCallback)
                        .progress(progressCallback);

                }, function(error) {
                    console.log('error get location: ',error);
                });


        }

        var arrowMarker = null;

        function previewFile (model) {
            //console.log('preview file: ', model);

            var filename = model.filename;
            if(filename == $scope.currentImage.filename) {
                $scope.currentImage.filename = '';
                $scope.currentImage.url = '';
                $scope.currentImage.coordinates = null;
                $scope.currentImage.heading = null;
                return;
            }

            $scope.currentImage.filename = filename;
            $scope.currentImage.url = UPLOAD_URL + filename;
            $scope.currentImage.coordinates = model.coordinates;
            $scope.currentImage.heading = model.heading;

            var coords = $scope.currentImage.coordinates;

            if(coords) {
                if(!photoGmapServices.map) photoGmapServices.createMap('photo-map');
                else google.maps.event.trigger(photoGmapServices.map, "resize");


                if (arrowMarker) {
                    arrowMarker.setMap(null);
                    arrowMarker = null;
                }

                var heading = $scope.currentImage.heading ? $scope.currentImage.heading : null;

                $timeout(function(){
                    photoGmapServices.setZoomIfGreater(20);
                    photoGmapServices.map.panTo(coords);

                    arrowMarker = photoGmapServices.createArrowMarker(coords, heading);
                }, 200);
            }
        }

    }
}());