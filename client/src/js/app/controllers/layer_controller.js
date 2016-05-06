(function () {
    'use strict';

    angular.module('demoApp')
        .controller('layerController', [layerController]);

    function layerController() {
        var vm = this;

        vm.layers = [
            {
                label: 'Layer1',
                action: 'layerCtl.toggleLayer1()',
                selected: false
            },
            {
                label: 'Layer2',
                action: 'layerCtl.toggleLayer2()',
                selected: false
            },
            {
                label: 'LayerWithChildren1',
                action: '',
                selected: false,
                children: [
                    {
                        label: 'Child1-1',
                        selected: false,
                        action: ''
                    },
                    {
                        label: 'Child1-2',
                        selected: false,
                        action: ''
                    }
                ]
            },
            {
                label: 'LayerWithChildren2',
                action: '',
                selected: false,
                children: [
                    {
                        label: 'Child2-1',
                        selected: false,
                        action: ''
                    },
                    {
                        label: 'Child2-2',
                        selected: false,
                        action: ''
                    }
                ]
            }
        ];


        vm.toggleLayer1 = toggleLayer1;
        vm.toggleLayer2 = toggleLayer2;


        function toggleLayer1 () {
            if (vm.layers[0].selected) {
                console.log('turn on layer1');
            } else {
                console.log('turn off layer1');
            }
        }

        function toggleLayer2 () {
            if (vm.layers[1].selected) {
                console.log('turn on layer2');
            } else {
                console.log('turn off layer2');
            }
        }
        /* Non Scope Functions here */

    }
}());