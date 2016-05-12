(function () {
    'use strict';

    angular.module('demoApp')
        .controller('indexController', ['$rootScope', 'Projects', '$mdSidenav', indexController]);

    function indexController($rootScope, Projects, $mdSidenav) {
        var vm = this;

        $rootScope.projects = [];

        vm.showList = false;

        vm.initialize = initialize;
        vm.toggleLayerPanel = buildToggler('layerPanel');
        vm.toggleSearchPanel = buildToggler('searchPanel');
        vm.closeSideNav = closeSideNav;

        vm.lastSideNavOpenId = '';

        vm.initialize();

        function initialize() {
            // load all projects here
            Projects.getList()
                .then(function(response){
                    console.log('get projects: ',response);
                    response.forEach(function(p){
                       $rootScope.projects.push(p);
                    });
                },function(error){
                    console.log('get projects error: ', error);
                });
        }

        function buildToggler(navID) {
            return function () {
                if (vm.lastSideNavOpenId && vm.lastSideNavOpenId !== navID) {
                    closeSideNav(vm.lastSideNavOpenId);
                }

                $mdSidenav(navID).toggle();

                vm.lastSideNavOpenId = navID;
            }
        }

        function closeSideNav(navID) {
            $mdSidenav(navID).close();
        }
    }
}());