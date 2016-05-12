(function () {
    'use strict';

    angular.module('demoApp.survey')
        .factory('locationServices', ['$q', 'gmapServices', locationServices]);

    function locationServices($q, gmapServices) {
        var service = {};

        function getError(error) {
            var errors = {
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            return "Error: " + errors[error.code];
        }

        service.getCurrentLocation = function () {
            var dfd = $q.defer();

            if (!navigator.geolocation) {
                dfd.reject('Browser doesnt support Geolocation');
                return dfd.promise;
            }

            var getPositionSuccess = function (position) {
                dfd.resolve(position);
            };

            var getPositionError = function (error) {
                console.log('getPositionError: ',error);
                dfd.reject(getError(error));
            };

            navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError, {enableHighAccuracy: true});

            return dfd.promise;
        };

        // Parameter must be a latLng
        service.showCurrentLocation = function (position) {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = gmapServices.showCurrentLocation(latLng);
            var offset = 0.002;


            gmapServices.panToOffsetLeft(latLng, offset);
            gmapServices.setZoomInDefault();

            return marker;
        };

        service.showDraggableLocation = function () {
            var draggable = true,
                latLng = gmapServices.map.getCenter();

            var marker = gmapServices.showCurrentLocation(latLng, draggable);

            //gmapServices.panToOffsetLeft(latLng);

            return marker;
        };

        return service;
    }

}());