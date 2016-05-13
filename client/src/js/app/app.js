(function () {
    'use strict';

    angular
        .module('demoApp', [
            'restangular',
            'ngMaterial',
            'ngAnimate',
            'oitozero.ngSweetAlert',
            'md.data.table',
            'demoApp.admin',
            'demoApp.survey'
        ])

        .constant('APP_NAME', 'Civic Solar Project Survey')
        .constant('BASE_URL', window.location.origin)
        .constant('UPLOAD_URL', window.location.origin + '/uploads/')

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            var baseUrl = window.location.origin + '/api';
            RestangularProvider.setBaseUrl(baseUrl);
        }])

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        });

}());

