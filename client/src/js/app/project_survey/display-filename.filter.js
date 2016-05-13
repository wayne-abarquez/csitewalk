(function(){
'use strict';

angular.module('demoApp.survey')
    .filter('displayFilename', [displayFilename]);

    function displayFilename () {
        return function (model) {
            return (angular.isString(model) && model != "") ? model.split(':')[1] : "None selected";
        }
    }
}());