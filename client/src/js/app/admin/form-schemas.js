(function () {
    'use strict';

    angular.module('demoApp.admin')
        .factory('FormSchemas', ['Restangular', FormSchemas]);

    function FormSchemas(Restangular) {
        var myModel = Restangular.all('form_schemas');

        var resource = {
            cast: function (obj) {
                return Restangular.restangularizeElement(null, obj, 'form_schemas');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }
}());