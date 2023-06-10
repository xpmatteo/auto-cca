"use strict";

const sqrt = Math.sqrt;
const abs = Math.abs;
const round = Math.round;
const trunc = Math.trunc;

// thanks https://www.redblobgames.com/grids/hexagons/implementation.html

class Hex {
    constructor(q, r, s=undefined) {
        if (s === undefined) {
            s = -q - r;
        }
        assertEquals(0, q + r + s, "q + r + s must be 0");
        this.q = q;
        this.r = r;
    }

    get s() { return - this.q - this.r }

    toString() {
        return `[${this.q},${this.r}]`;
    }

    distance(other) {
        return hex_length(hex_subtract(this, other));
    }

    neighbors() {
        return hex_directions.map((direction) => hex_add(this, direction));
    }
};

const hexes = Object.create(null);
export function hexOf(q, r) {
    if (hexes[[q, r]] === undefined) {
        hexes[[q, r]] = new Hex(q, r);   
    }
    return hexes[[q, r]];
}

const hex_directions = [
    hexOf(1, 0, -1), hexOf(1, -1, 0), hexOf(0, -1, 1), 
    hexOf(-1, 0, 1), hexOf(-1, 1, 0), hexOf(0, 1, -1)
];

class Orientation {
    // start_angle is in multiples of 60°
    constructor(f0_, f1_, f2_, f3_, b0_, b1_, b2_, b3_, start_angle_) {
        this.f0 = f0_; 
        this.f1 = f1_; 
        this.f2 = f2_; 
        this.f3 = f3_;
        this.b0 = b0_;
        this.b1 = b1_;
        this.b2 = b2_;
        this.b3 = b3_;
        this.start_angle = start_angle_;
    }
};

export class Point {
    x; y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }
}

export class Layout {    
    constructor(orientation, size, origin) {
        this.orientation = orientation;
        this.size = size;
        this.origin = origin;
    }
}

export function hex_to_pixel(layout, hex) {
    let M = layout.orientation;
    let x = (M.f0 * hex.q + M.f1 * hex.r) * layout.size.x;
    let y = (M.f2 * hex.q + M.f3 * hex.r) * layout.size.y;
    return new Point(x + layout.origin.x, y + layout.origin.y);
}

export function pixel_to_hex(layout, p) {
    const M = layout.orientation;
    let pt = new Point((p.x - layout.origin.x) / layout.size.x, 
                        (p.y - layout.origin.y) / layout.size.y);
    let q = M.b0 * pt.x + M.b1 * pt.y;
    let r = M.b2 * pt.x + M.b3 * pt.y;
    return hex_round(q, r, -q - r);
}

function hex_round(fracq, fracr, fracs) {
    let q = round(fracq);
    let r = round(fracr);
    let s = round(fracs);
    let q_diff = abs(q - fracq);
    let r_diff = abs(r - fracr);
    let s_diff = abs(s - fracs);
    if (q_diff > r_diff && q_diff > s_diff) {
        q = -r - s;
    } else if (r_diff > s_diff) {
        r = -q - s;
    } else {
        s = -q - r;
    }
    return hexOf(q, r, s);
}

function hex_add(a, b) {
    return hexOf(a.q + b.q, a.r + b.r, a.s + b.s);
}

function hex_subtract(a, b) {
    return hexOf(a.q - b.q, a.r - b.r, a.s - b.s);
}

function hex_length(hex) {
    return trunc((abs(hex.q) + abs(hex.r) + abs(hex.s)) / 2);
}

export const layout_pointy
  = new Orientation(sqrt(3.0), sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0,
                sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0,
                0.5);


function assertEquals(expected, actual, message = "Assertion failed") {
    if (expected != actual) {
        throw new Error(message + ": expected " + expected + ", got " + actual);
    }
}

function assertDeepEquals(expected, actual, message = "Assertion failed") {
    if (JSON.stringify(expected) != JSON.stringify(actual)) {
        throw new Error(message + ": expected " + expected + ", got " + actual);
    }
}


const test_layout = new Layout(layout_pointy, new Point(50, 60), new Point(10, 100));
assertDeepEquals(layout_pointy, test_layout.orientation);
assertDeepEquals(hex_to_pixel(test_layout, hexOf(0, 0, 0)), new Point(10, 100));
assertEquals(  0, hexOf(1,  -1, 0).s);
assertEquals(-30, hexOf(10, 20)   .s);
