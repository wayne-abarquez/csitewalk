(function(){
'use strict';

angular.module('demoApp.admin')
    .factory('Users', ['Restangular', Users]);

    function Users(Restangular) {
        var myModel = Restangular.all('users');

        var resource = {
            cast: function (obj) {
                return Restangular.restangularizeElement(null, obj, 'users');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }
}());