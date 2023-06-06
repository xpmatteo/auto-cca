
import {test, assertTrue, assertEquals } from '../lib/test_lib.js';
import loadAllImagesThen from './load_all_images.js';


test('load images', function () {
    function assertThem(images) {
        assertTrue(Object.keys(images).length === 2);
        assertTrue(images['images/units/rom_inf_hv.png'] instanceof Image);
    }

    loadAllImagesThen(assertThem, ['images/units/rom_inf_hv.png', 'images/units/rom_inf_lt.png']);
});
