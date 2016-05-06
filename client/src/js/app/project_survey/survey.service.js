(function(){
'use strict';

angular.module('demoApp')
    .factory('surveyLocationServices', ['$q', 'locationServices', 'gmapServices', '$timeout', surveyLocationServices]);

    function surveyLocationServices ($q, locationServices, gmapServices, $timeout) {
        var service = {};

        var locationMarker = null;

        service.showSurveyLocationMarker = showSurveyLocationMarker;
        service.getCurrentLocation = getCurrentLocation;
        service.dropAndPointSurveyLocation = dropAndPointSurveyLocation;

        function positionSurveyLocationMarker (position) {
            if (!locationMarker) {
                locationMarker = gmapServices.createCustomMarker(position);
            } else {
                if (!locationMarker.getMap()) gmapServices.showMarker(locationMarker);
                locationMarker.setPosition(position);
            }
        }

        function showSurveyLocationMarker (position) {
            positionSurveyLocationMarker(position);

            $timeout(function(){
                gmapServices.panTo(position);
                gmapServices.setZoomIfGreater(20);
            }, 100);
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


        return service;
    }
}());