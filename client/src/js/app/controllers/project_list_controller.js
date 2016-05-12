(function () {
    'use strict';

    angular.module('demoApp')
        .controller('projectListController', ['$rootScope', '$scope', 'projectsServices', projectListController]);

    function projectListController($rootScope, $scope, projectsServices) {
        var vm = this;

        vm.projects = [];

        vm.query = {
            order: 'status',
            limit: 10,
            page: 1,
            filter: ''
        };

        vm.filter = {
            show: false,
            form: null
        };

        vm.searchFilters = {
            project_status: "",
            project_name: "",
            project_manager: {fullname: ""},
            contractor: {name: ""},
            civicsolar_account_manager: {fullname: ""}
        };

        vm.initialize = initialize;
        vm.close = close;
        vm.onClickRow = onClickRow;
        vm.showProjectDetails = showProjectDetails;
        vm.onReorder = onReorder;
        vm.removeFilter = removeFilter;

        vm.initialize();

        function initialize() {
            $scope.$watch(angular.bind(vm, function () {
                return vm.query.filter;
            }), startFilter);

            $rootScope.$watchCollection('projects', function(newValue){
                loadProjects(newValue);
            });
        }

        /* Table Functions */

        function onReorder() {}

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';
            if (vm.filter.form.$dirty) vm.filter.form.$setPristine();
        }

        function onClickRow(project) {
            projectsServices.findAndShowMarker(project.id);
        }

        function showProjectDetails(proj) {
            projectsServices.findAndShowProjectDetail(proj.id);

        }

        function loadProjects(project) {
            vm.projects = angular.copy(project);
            filterList();
        }

        function startFilter() {
            vm.query.filter = vm.query.filter.toLowerCase();

            for (var key in vm.searchFilters)
                if (vm.searchFilters.hasOwnProperty(key))
                    vm.searchFilters[key] = vm.query.filter;

            filterList();
        }

        function filterList() {
            if (isEmptyFilter())
                vm.projects = angular.copy($rootScope.projects);
            else {
                var filtered = manualFilter(vm.searchFilters);
                vm.projects = filtered;
            }
        }

        function manualFilter(searchFilters) {
            var result = [];
            vm.projects.forEach(function (lot) {
                for (var key in searchFilters) {
                    var lotData = String(lot[key]).toLowerCase();
                    if (lotData.indexOf(vm.query.filter) !== -1) {
                        result.push(lot);
                        return;
                    }
                }
            });
            return result;
        }

        function isEmptyFilter() {
            return vm.query.filter === '';
        }

        function close() {
            $mdDialog.hide();
        }
    }
}());