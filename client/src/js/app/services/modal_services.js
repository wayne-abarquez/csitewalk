(function () {
    'use strict';

    angular.module('demoApp')
        .factory('modalServices', ['$q', '$mdDialog', '$mdMedia', '$rootScope', modalServices]);

    function modalServices($q, $mdDialog, $mdMedia, $rootScope) {
        var service = {};

        var customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        //var addressSearchModal;

        /* Service Functions */
        //service.showAddressSearch = showAddressSearch;
        service.closeModal = closeModal;

        function showModal(modalObj, modalParams) {
            var dfd = $q.defer();
            if (modalObj) {
                dfd.reject("Modal already opened");
            } else {
                $rootScope.$broadcast("modal-opened");
                modalObj = $mdDialog.show(modalParams);
                modalObj.then(function (result) {
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast("modal-dismissed");
                        dfd.reject(reason);
                    })
                    .finally(function () {
                        modalObj = null;
                    });
            }
            return dfd.promise;
        }

        //function showAddressSearch(ev) {
        //    var opts = {
        //        controller: 'addressSearchController',
        //        controllerAs: 'vm',
        //        templateUrl: '/partials/modals/_address_search.html',
        //        parent: angular.element(document.body),
        //        targetEvent: ev,
        //        fullscreen: $mdMedia('sm')
        //    };
        //
        //    return showModal(addressSearchModal, opts);
        //}

        // Close Modal
        function closeModal() {
            $mdDialog.cancel();
        }

        return service;
    }
}());