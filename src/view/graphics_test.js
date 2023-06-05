
import {test, assertTrue, assertEquals } from '../lib/test_lib.js';
import {load_all_images} from './graphics.js';

test('load images', function () {
    load_all_images(['images/units/rom_inf_hv.png', 'images/units/rom_inf_lt.png'], function (images) {
        assertTrue(Object.keys(images).length === 2);
        assertTrue(images['images/units/rom_inf_hv.png'] instanceof Image);
    });
});
