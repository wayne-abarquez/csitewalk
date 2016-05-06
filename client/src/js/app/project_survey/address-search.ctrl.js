(function(){
'use strict';

angular.module('demoApp.survey')
    .controller('addressSearchController', ['gmapServices', 'surveyLocationServices', addressSearchController]);

    function addressSearchController (gmapServices, surveyLocationServices) {
        var vm = this;

        var autocomplete;

        vm.initialize = initialize;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            autocomplete = gmapServices.initializeAutocomplete('address-search-input');
            autocomplete.addListener('place_changed', placeChangeCallback);
        }

        function placeChangeCallback() {
            var place = autocomplete.getPlace();

            if (!place.geometry) {
                alert("Autocomplete's returned place contains no geometry");
                return;
            }

            surveyLocationServices.showSurveyLocationMarker(place.geometry.location);
        }

    }
}());