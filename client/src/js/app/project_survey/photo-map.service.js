(function(){
'use strict';

angular.module('demoApp.survey')
    .factory('photoGmapServices', ['$timeout', 'gmapServices', photoGmapServices]);

    function photoGmapServices($timeout, gmapServices) {
        var service = {};

        service.map = null;

        service.createMap = createMap;
        service.createArrowMarker = createArrowMarker;
        service.setZoom = setZoom;
        service.setZoomIfGreater = setZoomIfGreater;

        function createMap(mapId) {
            var mapIdLoc = mapId || 'map3d';

            if (service.map) {
                $timeout(function(){
                    google.maps.event.trigger(service.map, "resize");
                });
                return service.map;
            }

            if (!gmapServices.apiAvailable()) return null;

            var mapOptions = {
                zoom: gmapServices.defaultZoom,
                minZoom: 2,
                center: gmapServices.defaultLatLng,
                mapTypeId: google.maps.MapTypeId.MAP,
                mapTypeControl: false,
                zoomControl: false,
                panControl: false,
                streetViewControl: false
            };

            service.map = new google.maps.Map(document.getElementById(mapIdLoc), mapOptions);

            // handle window resize event
            google.maps.event.addDomListener(window, 'resize', function () {
                google.maps.event.trigger(service.map, 'resize');
                service.map.setCenter(service.map.getCenter());
            });

            $timeout(function () {
                google.maps.event.trigger(service.map, "resize");
            });

            return service.map;
        }

        function createArrowMarker(_position, heading) {
            if (!gmapServices.apiAvailable()) return null;

            //var icon = 'images/markers/arrow.png';

            var arrow = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4
            };

            var xSymbol = {
                path: 'M -2,-2 2,2 M 2,-2 -2,2',
                strokeColor: '#000',
                strokeWeight: 3,
                scale: 3
            };

            if(heading) arrow['rotation'] = heading;

            var opts = {
                position: _position,
                map: service.map,
                icon: heading ? arrow : xSymbol
            };

            return new google.maps.Marker(opts);
        }

        function setZoom(zoomValue) {
            if (service.map) {
                service.map.setZoom(zoomValue);
            }
        }

        function setZoomIfGreater(zoomValue) {
            if (zoomValue > service.map.getZoom())
                service.setZoom(zoomValue);
        }

        return service;
    }


}());