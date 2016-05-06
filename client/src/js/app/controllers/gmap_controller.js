(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['gmapServices', 'surveyLocationServices', gmapController]);

    function gmapController(gmapServices, surveyLocationServices) {

        var vm = this;

        vm.showAddressSearchContainer = false;

        vm.initialize = initialize;
        vm.getCurrentLocation = getCurrentLocation;
        vm.dropLocation = dropLocation;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas');
        }

        function getCurrentLocation () {
            surveyLocationServices.getCurrentLocation()
                .then(function(response){
                    console.log('success: ',response);
                }, function(error){
                    console.log('error: ',error);
                });
        }

        function dropLocation () {
            surveyLocationServices.dropAndPointSurveyLocation();
        }
    }
}());