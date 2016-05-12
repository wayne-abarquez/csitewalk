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

    }
}());