(function(){
'use strict';

angular.module('demoApp')
    .factory('surveyLocationServices', ['$q', 'locationServices', 'gmapServices', '$timeout', surveyLocationServices]);

    function surveyLocationServices ($q, locationServices, gmapServices, $timeout) {
        var service = {};

        var locationMarkerIcon = 'images/markers/current-location.png';
        var locationMarker = null;

        service.locationAddress = '';

        service.showSurveyLocationMarker = showSurveyLocationMarker;
        service.hideSurveyLocationMarker = hideSurveyLocationMarker;
        service.getCurrentLocation = getCurrentLocation;
        service.dropAndPointSurveyLocation = dropAndPointSurveyLocation;
        service.getLocation = getLocation;

        function positionSurveyLocationMarker (position) {
            if (!locationMarker) {
                locationMarker = gmapServices.createCustomMarker(position, locationMarkerIcon);
            } else {
                if (!locationMarker.getMap()) gmapServices.showMarker(locationMarker);
                locationMarker.setPosition(position);
            }
        }

        function hideSurveyLocationMarker () {
            if(locationMarker && locationMarker.getMap()) {
                locationMarker.setMap(null);
                locationMarker = null;
            }
        }


        function initSurveyLocationMarker(position) {
            positionSurveyLocationMarker(position);

            $timeout(function () {
                gmapServices.panTo(position);
                gmapServices.setZoomIfGreater(20);
            }, 100);
        }

        service.geocodeLocation = geocodeLocation;

        function geocodeLocation () {
            var dfd = $q.defer();

            gmapServices.reverseGeocode(locationMarker.getPosition())
                .then(function (response) {
                    dfd.resolve(response);
                    //service.locationAddress = response[0].formatted_address;
                }, function(error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function showSurveyLocationMarker (position, address) {
            if(address) service.locationAddress = address;

            initSurveyLocationMarker(position);
        }

        function getCurrentLocation () {
            var dfd = $q.defer();

            locationServices.getCurrentLocation()
                .then(function (response) {
                    var position = {lat: response.coords.latitude, lng: response.coords.longitude};
                    showSurveyLocationMarker(position);
                    dfd.resolve(response);
                }, function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function dropAndPointSurveyLocation () {
            positionSurveyLocationMarker(gmapServices.map.getCenter());
            locationMarker.setDraggable(true);
        }

        function getLocation () {
            if (locationMarker && locationMarker.getMap()) {
                var position = locationMarker.getPosition();
                //geocodeLocation(position);
                return position;
            }

            return false;
        }

        return service;
    }
}());