(function () {
    'use strict';

    angular.module('demoApp.admin')
        .factory('Projects', ['Restangular', 'Upload', Projects]);

    function Projects(Restangular, Upload) {

        var myModel = Restangular.all('projects');

        Restangular.extendModel('projects', function (model) {

            model.upload = function (_file, _fields) {
                var uploadUrl = model.getRestangularUrl() + '/' + 'files';

                return Upload.upload({
                    url: uploadUrl,
                    method: 'POST',
                    fields: _fields,
                    file: _file
                });
            };

            return model;
        });

        var resource = {
            cast: function (obj) {
                return Restangular.restangularizeElement(null, obj, 'projects');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }




}());