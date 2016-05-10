(function () {
    'use strict';

    angular.module('demoApp')
        .factory('modalServices', ['$q', '$mdDialog', '$mdMedia', '$rootScope', modalServices]);

    function modalServices($q, $mdDialog, $mdMedia, $rootScope) {
        var service = {};

        //var customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var addProjectModal,
            projectDetailModal
        ;

        /* Service Functions */
        service.showAddProject = showAddProject;
        service.showProjectDetail = showProjectDetail;
        service.hideResolveModal = hideResolveModal;
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

        function showAddProject(ev, selectedPosition, address) {
            var opts = {
                controller: 'addProjectController',
                controllerAs: 'vm',
                templateUrl: '/projects/add',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {position: selectedPosition, positionAddress: address},
                fullscreen: $mdMedia('lg')
            };
            return showModal(addProjectModal, opts);
        }

        function showProjectDetail(proj) {
            var opts = {
                controller: 'projectDetailsController',
                controllerAs: 'vm',
                templateUrl: '/projects/edit',
                parent: angular.element(document.body),
                locals: {project: proj},
                fullscreen: $mdMedia('lg')
            };
            return showModal(projectDetailModal, opts);
        }

        function hideResolveModal (response) {
            $mdDialog.hide(response);
        }

        // Close Modal
        function closeModal() {
            $mdDialog.cancel();
        }

        return service;
    }
}());