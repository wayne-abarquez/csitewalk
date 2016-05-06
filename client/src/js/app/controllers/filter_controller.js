(function () {
    'use strict';

    angular.module('demoApp')
        .controller('filterController', ['gmapServices', 'alertServices', filterController]);

    function filterController(gmapServices, alertServices) {
        var vm = this;

        vm.filterLayer = '';

        var searchMarker = null;
        var searchInfowindow = null;

        var autocomplete = null;

        vm.initialize = initialize;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            autocomplete = gmapServices.initializeAutocomplete('filter-location-input');

            autocomplete.addListener('place_changed', placeChangeCallback);
        }


        //function showResult(data) {
        //    if (!searchInfowindow) searchInfowindow = gmapServices.createInfoWindow('');
        //
        //    if (!searchMarker) {
        //        searchMarker = gmapServices.createCustomMarker(data.coordinates);
        //    } else {
        //        if (!searchMarker.getMap()) gmapServices.showMarker(searchMarker);
        //
        //        searchMarker.setPosition(data.coordinates);
        //    }
        //
        //    searchInfowindow.setContent(data.content);
        //
        //    gmapServices.addListener(searchMarker, 'click', function () {
        //        searchInfowindow.open(gmapServices.map, searchMarker);
        //    });
        //
        //    gmapServices.triggerEvent(searchMarker, 'click');
        //}
        //
        //function hideSearchMarker() {
        //    if (searchMarker && searchMarker.getMap()) {
        //        gmapServices.hideMarker(searchMarker);
        //    }
        //}

        function placeChangeCallback() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                alert("Autocomplete's returned place contains no geometry");
                return;
            }
            //console.log('Place Changed!', place);
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                gmapServices.map.fitBounds(place.geometry.viewport);
            } else {
                gmapServices.map.setCenter(place.geometry.location);
                gmapServices.map.setZoom(15);
            }
        }


        /* Non Scope Functions here */

    }
}());