(function () {
    'use strict';

    angular
        .module('demoApp', [
            'restangular',
            'ngMaterial',
            'ngAnimate',
            'oitozero.ngSweetAlert',
            'demoApp.admin',
            'demoApp.survey'
        ])

        .constant('APP_NAME', 'Civic Solar Project Survey')
        .constant('BASE_URL', window.location.origin)

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

