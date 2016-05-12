(function () {
    'use strict';

    angular.module('demoApp.admin')
        .controller('formSchemaController', ['formSchemaServices', 'alertServices', formSchemaController]);

    function formSchemaController(formSchemaServices, alertServices) {
        var vm = this;

        vm.jsonFiles = [];

        vm.jsonEditor = {
            data: null,
            options: {
                mode: 'tree'
            }
        };

        var lastSelectedFile = null,
            selectedFile = null;


        vm.initialize = initialize;
        vm.selectFile = selectFile;
        vm.saveCurrentFile = saveCurrentFile;
        vm.saveAllFiles = saveAllFiles;
        vm.refresh = refresh;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            loadSchemas();
        }

        function selectFile(file) {
            if(lastSelectedFile) lastSelectedFile.active = false;
            if (selectedFile && vm.jsonEditor.data) selectedFile.data = vm.jsonEditor.data;

            selectedFile = file;
            selectedFile.active = true;
            vm.jsonEditor.data = selectedFile.data;

            lastSelectedFile = selectedFile;
        }

        function loadSchemas () {
            return formSchemaServices.getSchemas()
                .then(function(response){
                    vm.jsonFiles = angular.copy(response);
                    if (vm.jsonFiles &&  vm.jsonFiles.length > 0)
                        selectFile(vm.jsonFiles[0]);
                });
        }

        function saveCurrentFile() {
            var file = _.findWhere(vm.jsonFiles, {active: true});
            if (file) {
                file.data = vm.jsonEditor.data;
                formSchemaServices.saveSchema(file)
                    .then(function (response) {
                        alertServices.showTopRightToast('Current File Saved.');
                    }, function (response) {
                        console.log('failed to save current file');
                    });
            }
        }

        function saveAllFiles () {
            var index = 0;

            var doFail = function () {
                console.log('failed saving all files');
            };

            var doSave = function () {
                if (index < vm.jsonFiles.length) {
                    var file = vm.jsonFiles[index++];
                    return formSchemaServices.saveSchema(file).then(doSave, doFail);
                } else {
                    alertServices.showTopRightToast('All Files Saved.');
                    return null;
                }
            };

            var file = _.findWhere(vm.jsonFiles, {active: true});
            if (file) file.data = vm.jsonEditor.data;
            doSave();
        }

        function refresh () {
            loadSchemas()
                .finally(function(){
                    alertServices.showTopRightToast('Done Refresh.');
                });
        }

    }
}());