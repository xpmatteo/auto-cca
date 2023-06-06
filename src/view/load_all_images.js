
const IMAGE_URLS = [
    'images/cca_map_hq.jpg',
    
    'images/units/rom_aux.png',
    'images/units/rom_cav_hv.png',
    'images/units/rom_cav_lt.png',
    'images/units/rom_cav_md.png',
    'images/units/rom_char.png',
    'images/units/rom_elephant.png',
    'images/units/rom_inf_hv.png',
    'images/units/rom_inf_lt.png',
    'images/units/rom_inf_lt_bow.png',
    'images/units/rom_inf_lt_sling.png',
    'images/units/rom_inf_md.png',
    'images/units/rom_inf_war.png',
    'images/units/rom_leader.png',
    'images/units/rom_leader_grey.png',
    'images/units/rom_leader_grey_rectangular.png',
    'images/units/rom_ship.png',
    'images/units/rom_warmachine.png',

    'images/units/car_aux.png',
    'images/units/car_cav_hv.png',
    'images/units/car_cav_lt.png',
    'images/units/car_cav_md.png',
    'images/units/car_char.png',
    'images/units/car_elephant.png',
    'images/units/car_inf_hv.png',
    'images/units/car_inf_lt.png',
    'images/units/car_inf_lt_bow.png',
    'images/units/car_inf_lt_slings.png',
    'images/units/car_inf_md.png',
    'images/units/car_inf_wa.png',
    'images/units/car_leader.png',
];

export const IMAGES = {}

export default function loadAllImagesThen(continuation, imageUrls = IMAGE_URLS) {
    let num_images = imageUrls.length;
    let num_loaded = 0;
    imageUrls.forEach(function (url) {
        let img = new Image();
        img.src = url;
        img.onload = function () {
            num_loaded++;
            if (num_loaded === num_images) {
                continuation(IMAGES);
            }
        };
        IMAGES[url] = img;
    });
}

