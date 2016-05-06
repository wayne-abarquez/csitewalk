(function(){
'use strict';

angular.module('demoApp.admin')
    .controller('userManagementController', ['Users', userManagementController]);

    function userManagementController (Users) {
        var vm = this;

        vm.users = [];

        vm.initialize = initialize;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            // fetch users
            Users.getList()
                .then(function(response){
                    //console.log('get users: ', response);
                    vm.users = angular.copy(response);
                });
        }

        /* Non Scope Functions here */

    }
}());