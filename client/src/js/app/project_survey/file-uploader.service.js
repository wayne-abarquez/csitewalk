(function(){
'use strict';

angular.module('demoApp.survey')
    .factory('fileUploaderServices', [fileUploaderServices]);

    function fileUploaderServices() {
        var service = {};

        service.uploadProjectFile = uploadProjectFile;

        function uploadProjectFile (projectModel, file, modelName) {
            var name_parts = modelName.split('.');
            var section = name_parts[name_parts.length - 2];
            var field = name_parts[name_parts.length - 1];

            return projectModel.upload(file, {section: section, field: field});
        }

        return service;
    }
}());