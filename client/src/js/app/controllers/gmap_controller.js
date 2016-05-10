(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'surveyLocationServices', 'modalServices', 'projectsServices', gmapController]);

    function gmapController($rootScope, gmapServices, surveyLocationServices, modalServices, projectsServices) {

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
            $(document).on('click', '.btn_view_solar_detail', function () {
                //$rootScope.solarDetailSelectedTab = 0;
                projectsServices.showProjectDetail($rootScope.selectedProject);
            });
        }

        function showSolarDetailInfowindow(_solar) {
            if (!(_solar && _solar.id)) return;

            solarGmapServices.hideSolarMarkers();

            var defered = modalServices.showUpdateSolar(_solar, vm, event);
            defered.then(function (response) {
                console.log('modalServices.showUpdateSolar response:');
                console.log(response);

                if (!response) return;

                solarGmapServices.gmapService.setZoomDefault();
                solarGmapServices.showSolarMarkers();

                if ($rootScope.selectedSolar && response) {
                    $rootScope.selectedSolar.coordinates = response.coordinates;
                }
            }, function (errorResponse) {

                solarGmapServices.gmapService.setZoomDefault();
                solarGmapServices.showSolarMarkers();


                console.log('show update solar detail failed');
                console.log(errorResponse);
            });
            //defered.finally(function(response){
            //    console.log('finally response: ');
            //    console.log(response);
            //    solarGmapServices.showSolarMarkers();
            //    solarGmapServices.gmapService.setZoomDefault();
            //});
        }

        function loadProjects (newValue, oldValue) {
            if(newValue == oldValue) return;

            //console.log('newValue projects: ', newValue);
            projectsServices.initializeMarkers(newValue);
        }

        function getCurrentLocation () {
            vm.showAddressSearchContainer = false;

            surveyLocationServices.getCurrentLocation()
                .then(function(response){
                    showLocationButton();
                    console.log('success: ',response);
                }, function(error){
                    console.log('error: ',error);
                });
        }

        function dropLocation () {
            showLocationButton();
            vm.showAddressSearchContainer = false;

            surveyLocationServices.dropAndPointSurveyLocation();
        }

        function showAddressSearch () {
            showLocationButton();
            vm.showAddressSearchContainer = true;
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
                            console.log('success adding project: ', response);
                            // add project to list on rootScope
                        })
                        .finally(function () {
                            surveyLocationServices.hideSurveyLocationMarker();
                        });
                });
        }
    }
}());