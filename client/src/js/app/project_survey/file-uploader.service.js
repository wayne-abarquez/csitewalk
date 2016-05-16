(function(){
'use strict';

angular.module('demoApp.survey')
    .factory('fileUploaderServices', [fileUploaderServices]);

    function fileUploaderServices() {
        var service = {};

        service.uploadProjectFile = uploadProjectFile;

        function uploadProjectFile (projectModel, file, modelName, coordinates, heading) {
            var name_parts = modelName.split('.');
            var section = name_parts[name_parts.length - 2];
            var field = name_parts[name_parts.length - 1];

            var data = {section: section, field: field};

            if(coordinates) angular.merge(data, coordinates);
            if(heading) data['heading'] = heading;

            return projectModel.upload(file, data);
        }

        return service;
    }
}());