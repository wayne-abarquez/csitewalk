(function () {
    'use strict';

    angular.module('demoApp.admin')
        .factory('Projects', ['Restangular', Projects]);

    function Projects(Restangular) {
        var myModel = Restangular.all('projects');

        var resource = {
            cast: function (obj) {
                return Restangular.restangularizeElement(null, obj, 'projects');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }
}());