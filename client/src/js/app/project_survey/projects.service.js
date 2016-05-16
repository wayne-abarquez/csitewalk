(function(){
'use strict';

angular.module('demoApp.survey')
    .factory('projectsServices', ['$rootScope', 'gmapServices', 'modalServices', '$timeout', projectsServices]);

    function projectsServices ($rootScope, gmapServices, modalServices, $timeout) {
        var service = {};

        var markers = [];

        service.hideMarkers = hideMarkers;
        service.showMarkers = showMarkers;
        service.initializeMarkers = initializeMarkers;
        service.showProjectDetail = showProjectDetail;
        service.findMarkerByProjectID = findMarkerByProjectID;
        service.findAndShowMarker = findAndShowMarker;
        service.findAndShowProjectDetail = findAndShowProjectDetail;

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
                    marker.id = proj.id;
                    marker.project = proj;
                    markers.push(marker);
                    gmapServices.addListener(marker, 'click', onClickMarker);
                }
                else if (i >= projects.length) {
                    if (markers[i])  markers[i].project = null;
                    gmapServices.hideMarker(markers[i]);
                }
                else if (markers[i]) {
                    markers[i].id = proj.id;
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

        function mapResponse (data) {
            if (!data['section_files']) data;
            for (var section in data['section_files']) {
                var section_files = data['section_files'][section];
                for (var modelname in section_files) {
                    if(!data['sections'][section]) {
                        data['sections'][section] = {};
                        if(!data['sections'][section][modelname]) data['sections'][section][modelname] = {};
                    }
                    data['sections'][section][modelname] = section_files[modelname];
                }
            }
            return data;
        }

        function showProjectDetail (proj) {
            if (!(proj && proj.id)) return;

            service.hideMarkers();

            proj.get().
            then(function(response){
                    var mappedResponse = mapResponse(response);
                    modalServices.showProjectDetail(mappedResponse)
                        .then(function (response) {
                            if (!response) return;
                            if ($rootScope.selectedProject && response) $rootScope.selectedProject.coordinates = response.coordinates;
                        }, function (errorResponse) {
                            console.log('show update solar detail failed');
                            console.log(errorResponse);
                        })
                        .finally(function () {
                            gmapServices.setZoomDefault();
                            service.showMarkers();
                        });
                }, function(error){
                    console.log('get project details error: ',error);
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
                '<p>' + (proj.contractor ? proj.contractor.name : 'Unassigned') + '</p>' +
                '<a href="#!" class="infowindow_btn btn_view_project_detail">More info</a>' +
                '<span class="arrow"></span>' +
                '</div>' +
                '</div>';
        }

        function findMarkerByProjectID (projectID) {
            var foundMarker = _.findWhere(markers, {id: projectID});
            return foundMarker;
        }

        function findAndShowMarker (projectID) {
            var foundMarker = service.findMarkerByProjectID(projectID);
            gmapServices.triggerEvent(foundMarker, 'click');
        }

        function findAndShowProjectDetail (projectID) {
            $timeout(function(){
                service.findAndShowMarker(projectID);
            }, 100)
            .then(function(){
                $timeout(function(){
                    $('a.btn_view_project_detail').trigger('click');
                }, 100);
            });
        }

        return service;
    }
}());