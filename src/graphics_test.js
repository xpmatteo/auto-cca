
import {test, assert, assert_equals, assert_deep_equals} from './test_lib.js';
import {load_all_images} from './graphics.js';

test('load images', function () {
    load_all_images(['images/units/rom_inf_hv.png', 'images/units/rom_inf_lt.png'], function (images) {
        assert(Object.keys(images).length === 2);
        assert(images['images/units/rom_inf_hv.png'] instanceof Image);
    });
});
