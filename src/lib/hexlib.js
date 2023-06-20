"use strict";

const sqrt = Math.sqrt;
const abs = Math.abs;
const round = Math.round;
const trunc = Math.trunc;

// thanks https://www.redblobgames.com/grids/hexagons/implementation.html

class Hex {
    constructor(q, r, s = undefined) {
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
        return HEX_DIRECTIONS.map(d => hex_add(this, d));
    }

    get northernNeighbors() {
        return [this.northEast, this.northWest];
    }

    get southernNeighbors() {
        return [this.southEast, this.southWest];
    }

    get southEast() {
        return hex_add(this, DIRECTION_SE);
    }

    get southWest() {
        return hex_add(this, DIRECTION_SW);
    }

    get northWest() {
        return hex_add(this, DIRECTION_NW);
    }

    get northEast() {
        return hex_add(this, DIRECTION_NE);
    }
};

// The only way to create a Hex is with hexOf(q, r)
const HEXES = [];
export function hexOf(q, r) {
    const key = q + r * 1000;
    if (HEXES[key] === undefined) {
        HEXES[key] = new Hex(q, r);
    }
    return HEXES[key];
}

const DIRECTION_WEST = hexOf(-1, 0);
const DIRECTION_NE =   hexOf(0, -1);
const DIRECTION_NW =   hexOf(1, -1);
const DIRECTION_SW =   hexOf(-1, 1);
const DIRECTION_SE =   hexOf(0, 1);
const DIRECTION_EAST = hexOf(1, 0);
const HEX_DIRECTIONS = [
    DIRECTION_EAST,
    DIRECTION_NW,
    DIRECTION_NE,
    DIRECTION_WEST,
    DIRECTION_SW,
    DIRECTION_SE
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

export const LAYOUT_POINTY = new Orientation(
    sqrt(3.0),
    sqrt(3.0) / 2.0,
    0.0,
    3.0 / 2.0,
    sqrt(3.0) / 3.0,
    -1.0 / 3.0,
    0.0,
    2.0 / 3.0,
    0.5);

function assertEquals(expected, actual, message = "Assertion failed") {
    if (expected !== actual) {
        throw new Error(message + ": expected " + expected + ", got " + actual);
    }
}

