import { hexOf } from "xlib/hexlib.js";
import * as units from "model/units.js";
import GameStatus from "model/game_status.js";
import { Side } from "model/side.js";
import { Scenario } from "model/scenarios.js";
import makeGame from "model/game.js";

class SomeScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 3;

    placeUnitsOn(board) {
    }
}

const scenario = new SomeScenario();

test ("first side", () => {
    expect(scenario.firstSide).toEqual(Side.ROMAN);
});

test("roman win", () => {
    let game = makeGame(scenario);
    game.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(3, 0), new units.CarthaginianHeavyInfantry());

    game.takeDamage(game.unitAt(hexOf(1, 0)), 4);
    game.takeDamage(game.unitAt(hexOf(2, 0)), 4);
    game.takeDamage(game.unitAt(hexOf(3, 0)), 4);

    expect(scenario.gameStatus(game)).toEqual(GameStatus.ROMAN_WIN);
});

test("carthaginian win", () => {
    let game = makeGame(scenario);
    game.placeUnit(hexOf(1, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(3, 0), new units.RomanHeavyInfantry());

    game.takeDamage(game.unitAt(hexOf(1, 0)), 4);
    game.takeDamage(game.unitAt(hexOf(2, 0)), 4);
    game.takeDamage(game.unitAt(hexOf(3, 0)), 4);

    expect(scenario.gameStatus(game)).toEqual(GameStatus.CARTHAGINIAN_WIN);
});

test("ongoing", () => {
    let game = makeGame(scenario);

    game.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 8), new units.RomanHeavyInfantry());

    expect(scenario.gameStatus(game)).toEqual(GameStatus.ONGOING);
});

