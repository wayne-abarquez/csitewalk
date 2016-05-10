(function(){
'use strict';

angular.module('demoApp.survey')
    .factory('projectsServices', ['$rootScope', 'gmapServices', 'modalServices', projectsServices]);

    function projectsServices ($rootScope, gmapServices, modalServices) {
        var service = {};

        var markers = [];

        service.hideMarkers = hideMarkers;
        service.showMarkers = showMarkers;
        service.initializeMarkers = initializeMarkers;
        service.showProjectDetail = showProjectDetail;

        function hideMarkers() {
            if (!markers || markers.length <= 0) return;
            gmapServices.hideMarkers(markers);
            // Close any infowindow
            gmapServices.closeAllInfoBox();
        }

        function showMarkers() {
            if (!markers || markers.length <= 0) return;
            gmapServices.showMarkers(markers);
        }

        function initializeMarkers(projects) {
            if (projects == null || projects == 'undefined') {
                service.hideMarkers();
                return;
            }

            // Close any infowindow
            gmapServices.closeAllInfoBox();

            for (var i = 0; i < markers.length || i < projects.length; i++) {
                var proj = projects[i];

                if (i >= markers.length) {
                    var marker = gmapServices.createCustomMarker(proj.coordinates);
                    marker.infowindow = initInfowindow(proj);
                    marker.project = proj;
                    markers.push(marker);
                    gmapServices.addListener(marker, 'click', onClickMarker);
                }
                else if (i >= projects.length) {
                    if (markers[i])
                        markers[i].project = null;
                    gmapServices.hideMarker(markers[i]);
                }
                else if (markers[i]) {
                    markers[i].project = proj;
                    markers[i].setPosition(proj.coordinates);
                    gmapServices.showMarker(markers[i]);
                }
            }
        }

        function onClickMarker() {
            gmapServices.openInfoBox(this.infowindow, this);
            gmapServices.panTo(this.getPosition());

            // this refers to clicked marker
            $rootScope.selectedProject = this.project;
        }

        function showProjectDetail (proj) {
            if (!(proj && proj.id)) return;

            service.hideMarkers();

            modalServices.showProjectDetail(proj)
            .then(function (response) {
                console.log('modalServices.showProjectDetail response: ', response);
                if (!response) return;
                if ($rootScope.selectedProject && response) $rootScope.selectedProject.coordinates = response.coordinates;
            }, function (errorResponse) {
                console.log('show update solar detail failed');
                console.log(errorResponse);
            })
            .finally(function(){
                gmapServices.setZoomDefault();
                service.showMarkers();
            });
        }

        function initInfowindow(proj) {
            var template = createInfowindowTemplate(proj);
            return gmapServices.createInfoBox(template);
        }

        function createInfowindowTemplate(proj) {
            return '<div class="marker_info none" id="marker_info">' +
                '<div class="info" id="info">' +
                '<h4>' + proj.project_name + '<span></span></h4>' +
                '<p>' + proj.contractor.name + '</p>' +
                '<a href="#!" class="infowindow_btn btn_view_solar_detail">More info</a>' +
                '<span class="arrow"></span>' +
                '</div>' +
                '</div>';
        }

        return service;
    }
}());