import { InteractiveGame } from "./interactive_game.js";
import { hexOf } from './lib/hexlib.js';
import { ORDER_HEAVY_TROOPS_CARD } from "./model/cards.js";
import makeGame from './model/game.js';
import { MovementPhase } from "./model/phases/MovementPhase.js";
import { NullScenario } from './model/scenarios.js';
import { RomanHeavyInfantry } from './model/units.js';

function otherUnit() {
    return new RomanHeavyInfantry();
}

function makeGameInMovementPhase() {
    const game = makeGame(new NullScenario());
    const interactiveGame = new InteractiveGame(game);
    game.phases = [new MovementPhase()];
    return interactiveGame;
}

test('click and select unit', function () {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);
    game.orderUnit(hexOf(1, 1));
    game.placeUnit(hexOf(2, 1), otherUnit());
    expect(game.selectedUnit()).toEqual(undefined);

    game.onClick(hexOf(1, 1));

    expect(game.selectedUnit()).toEqual(unit);
    expect(game.selectedHex()).toEqual(hexOf(1, 1));
});

test('cannot select a spent unit', function () {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);
    game.orderUnit(hexOf(1, 1));

    game.onClick(hexOf(1, 1));
    game.onClick(hexOf(1, 2));

    expect(game.unitAt(hexOf(1, 2))).toEqual(unit);
    expect(game.selectedUnit()).toEqual(undefined);
    expect(game.isSpent(unit)).toBe(true);

    game.onClick(hexOf(1, 2));
    expect(game.selectedUnit()).toEqual(undefined);
});

test('click and deselect unit', function () {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

    game.onClick(hexOf(0, 0));
    game.onClick(hexOf(0, 0));

    expect(game.selectedUnit()).toEqual(undefined);
});

test('click nowhere and deselect', () => {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.orderUnit(hexOf(0, 0));

    game.onClick(hexOf(0, 0));
    expect(game.selectedUnit()).toEqual(unit);

    game.onClick(hexOf(100, 0));
    expect(game.selectedUnit()).toEqual(undefined);
});

test('click outside map does not move off-board', () => {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.orderUnit(hexOf(0, 0));

    game.onClick(hexOf(0, 0));
    expect(game.selectedUnit()).toEqual(unit);

    game.onClick(hexOf(0, -1));
    expect(game.selectedUnit()).toEqual(undefined);
    expect(game.unitAt(hexOf(0, 0))).toEqual(unit);
});

/*
     1,4   2,4    3,4
        1,5   2,5    3,5
     0,6   1,6    2,6    3,6
*/

test('click and move one unit', () => {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.orderUnit(hexOf(1, 5));
    game.onClick(hexOf(1, 5));

    game.onClick(hexOf(2, 5));
    expect(game.selectedUnit()).toEqual(undefined);
    expect(game.unitAt(hexOf(2, 5))).toEqual(unit);
});

test('hilighted hexes when no unit is selected', () => {
    const game = makeGame(new NullScenario());
    const interactiveGame = new InteractiveGame(game);
    game.playCard(ORDER_HEAVY_TROOPS_CARD);
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(0, 1), new RomanHeavyInfantry());

    expect(interactiveGame.hilightedHexes).toEqual(new Set([hexOf(0, 1), hexOf(0, 0)]));
});
