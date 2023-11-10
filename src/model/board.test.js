import { hexOf } from '../lib/hexlib.js';
import { Board, MAP_WEST } from './board.js';
import { RomanHeavyInfantry } from './units.js';

function makeBoard() {
    return new Board();
}

test('add units', function () {
    let game = makeBoard();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();

    game.placeUnit(hexOf(0, 0), unit0);
    game.placeUnit(hexOf(0, 1), unit1);

    let count = 0;
    game.foreachUnit((unit, hex) => {
        count++;
    });
    expect(count).toEqual(2);
    expect(game.unitAt(hexOf(0, 0))).toEqual(unit0);
    expect(game.unitAt(hexOf(0, 1))).toEqual(unit1);
});

test('add unit outside map', () => {
    let game = makeBoard();
    let unit = new RomanHeavyInfantry();

    expect(() => game.placeUnit(hexOf(100, 0), unit)).toThrow('Hex [100,0] outside of map');
});

test('stacking not allowed', () => {
    let game = makeBoard();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit0);

    expect(() => game.placeUnit(hexOf(0, 0), unit1)).toThrow('Unit already exists at [0,0]');
});

test('adding same unit in two places?', () => {
    let game = makeBoard();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

    expect(() => game.placeUnit(hexOf(0, 1), unit)).toThrow('Unit added twice');
});

test('map size', function () {
    let game = makeBoard();
    let count = 0;

    game.foreachHex((hex) => {
        count++;
    });

    expect(count).toEqual(5 * 13 + 4 * 12);
});

test('clone board', function () {
    let original = makeBoard();
    let unit0 = new RomanHeavyInfantry();
    original.placeUnit(hexOf(0, 0), unit0);

    let clone = original.clone();
    clone.moveUnit(hexOf(0, 1), hexOf(0, 0));

    expect(original.unitAt(hexOf(0, 0))).toEqual(unit0);
    expect(clone.unitAt(hexOf(0, 1))).toEqual(unit0);
});

describe('the west side of the map', () => {
    [hexOf(0, 0),
        hexOf(4, 0),
        hexOf(3, 2),
        hexOf(2, 3),
        hexOf(2, 4),
        hexOf(1, 5),
        hexOf(1, 6),
        hexOf(0, 7),
        hexOf(0, 8),
    ].forEach(hex => {
        it(`MAP_WEST contains ${hex}`, () => {
            expect(MAP_WEST).toContain(hex);
        });
    });

    [
        hexOf(5, 0),
        hexOf(4, 1),
        hexOf(4, 2),
        hexOf(3, 3),
        hexOf(3, 4),
        hexOf(2, 5),
        hexOf(2, 6),
        hexOf(1, 7),
        hexOf(1, 8),
        ].forEach(hex => {
        it(`MAP_WEST does not contain ${hex}`, () => {
            expect(MAP_WEST).not.toContain(hex);
        });
    })

});
