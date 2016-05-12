(function(){
'use strict';

angular.module('demoApp.survey')
    .controller('projectDetailsController', ['project', '$scope', '$q', '$controller', 'modalServices', 'utilServices', projectDetailsController]);

    function projectDetailsController (project, $scope, $q, $controller, modalServices, utilServices) {
        $controller('errorController', {$scope: $scope});

        $scope.project = {
            id: 0
        };

        $scope.initialize = initialize;
        $scope.save = save;
        $scope.close = close;

        $scope.initialize();

        function initialize () {
            //console.log('selectedProject: ',project);

            // Fixes bug on WTForms SelectField
            if(project.project_manager) project.project_manager.id = String(project.project_manager.id);
            if(project.contractor) project.contractor.id = String(project.contractor.id);
            if(project.civicsolar_account_manager) project.civicsolar_account_manager.id = String(project.civicsolar_account_manager.id);

            $scope.project = project;
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

        // todo
        $scope.fileChanged = function(files, rejectedFiles) {
        };

        // todo
        $scope.filePreview = function(modelName) {
        };

        function close () {
            modalServices.closeModal();
        }
    }
}());