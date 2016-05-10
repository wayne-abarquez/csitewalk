(function(){
'use strict';

angular.module('demoApp')
    .controller('addProjectController', ['$scope', 'modalServices', 'Projects', 'position', 'positionAddress', addProjectController]);

    function addProjectController ($scope, modalServices, Projects, position, positionAddress) {
        var vm = this;

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
                    // dismiss modal
                    modalServices.hideResolveModal(response);
                },function(error){
                    console.log('error adding project: ', error);
                    // TODO: show errors
                });
        }

        function close () {
            modalServices.closeModal();
        }

    }
}());