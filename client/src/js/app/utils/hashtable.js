(function(){
'use strict';

angular.module('demoApp')
    .factory('HashTable', [HashTable]);

    function HashTable () {

        var uniqueId = 0;

        function generateUniqueId() {
            return (uniqueId++).toString();
        }

        function HashTable() {
            this.hash = {};
        }

        HashTable.prototype.get = function (key) {
            if (typeof key === "string") {
                return this.hash[key];
            }
            if (key._hashtableUniqueId == undefined) {
                return undefined;
            }
            return this.hash[key._hashtableUniqueId];
        }

        HashTable.prototype.put = function (key, value) {
            if (typeof key === "string") {
                this.hash[key] = value;
            }
            else {
                if (key._hashtableUniqueId == undefined) {
                    key._hashtableUniqueId = generateUniqueId();
                }
                this.hash[key._hashtableUniqueId] = value;
            }
        }

        HashTable.prototype.clear = function () {
            this.hash = {};
        }

        return (HashTable);
    }
}());