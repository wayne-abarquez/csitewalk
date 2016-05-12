(function(){
'use strict';

angular.module('demoApp.admin')
    .factory('formSchemaServices', ['FormSchemas', formSchemaServices]);

    function formSchemaServices (FormSchemas) {
        var service = {};

        service.getSchemas = getSchemas;
        service.saveSchema = saveSchema;

        function getSchemas () {
            return FormSchemas.getList();
        }

        function saveSchema (file) {
            return FormSchemas.customPOST(file.data, file.name);
        }

        return service;
    }
}());