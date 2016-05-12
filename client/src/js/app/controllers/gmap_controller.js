(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'surveyLocationServices', 'modalServices', 'projectsServices', 'alertServices', gmapController]);

    function gmapController($rootScope, gmapServices, surveyLocationServices, modalServices, projectsServices, alertServices) {

        var vm = this;

        vm.showSaveLocationBtn = false;
        vm.showAddressSearchContainer = false;

        vm.initialize = initialize;
        vm.getCurrentLocation = getCurrentLocation;
        vm.showAddressSearch = showAddressSearch;
        vm.dropLocation = dropLocation;
        vm.saveLocation = saveLocation;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas');

            $rootScope.$watchCollection('projects', loadProjects);

            /*
             *  Trigger a modal
             *  show Project Detail
             */
            $(document).on('click', '.btn_view_project_detail', function () {
                //$rootScope.solarDetailSelectedTab = 0;
                projectsServices.showProjectDetail($rootScope.selectedProject);
            });
        }

        function loadProjects (newValue, oldValue) {
            if(newValue == oldValue) return;
            projectsServices.initializeMarkers(newValue);
        }

        function getCurrentLocation () {
            hideAddressBar();

            surveyLocationServices.getCurrentLocation()
                .then(function(response){
                    showLocationButton();
                    console.log('success: ',response);
                }, function(error){
                    console.log('error: ',error);
                });
        }

        function dropLocation () {
            hideAddressBar();
            showLocationButton();

            alertServices.showTopRightToast('Drag Marker to Relocate');

            surveyLocationServices.dropAndPointSurveyLocation();
        }

        function showAddressSearch () {
            showLocationButton();
            vm.showAddressSearchContainer = true;
        }

        function hideAddressBar() {
            if (vm.showAddressSearchContainer) vm.showAddressSearchContainer = false;
        }

        function showLocationButton () {
            vm.showSaveLocationBtn = true;
        }

        function hideLocationButton () {
            vm.showSaveLocationBtn = false;
        }

        function saveLocation (event) {
            hideLocationButton();

            var selectedPosition = surveyLocationServices.getLocation();

            surveyLocationServices.geocodeLocation()
                .then(function(response){
                    // show modal here
                    modalServices.showAddProject(event, selectedPosition, response[0].formatted_address)
                        .then(function(response){
                            // add project to list on rootScope
                            $rootScope.projects.push(response);
                        })
                        .finally(function () {
                            surveyLocationServices.hideSurveyLocationMarker();
                        });
                });
        }
    }
}());