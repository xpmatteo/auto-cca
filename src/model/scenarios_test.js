import { assertEquals, test } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { Board } from "./board.js";
import * as units from "./units.js";
import * as GameStatus from "./game_status.js";
import { Side } from "./side.js";
import { ScenarioRaceToOppositeSide } from "./scenarios.js";
import makeGame from "./game.js";

const scenario = new ScenarioRaceToOppositeSide();

test ("first side", () => {
    assertEquals(Side.ROMAN, scenario.firstSide);
});

test("roman win", () => {
    let game = makeGame(scenario);
    game.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(3, 0), new units.CarthaginianHeavyInfantry());

    game.killUnit(hexOf(1, 0));
    game.killUnit(hexOf(2, 0));
    game.killUnit(hexOf(3, 0));

    assertEquals(GameStatus.ROMAN_WIN, scenario.gameStatus(game));
});

test("carthaginian win", () => {
    let game = makeGame(scenario);
    game.placeUnit(hexOf(1, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(3, 0), new units.RomanHeavyInfantry());

    game.killUnit(hexOf(1, 0));
    game.killUnit(hexOf(2, 0));
    game.killUnit(hexOf(3, 0));

    assertEquals(GameStatus.CARTHAGINIAN_WIN, scenario.gameStatus(game));
});

test("ongoing", () => {
    let game = makeGame(scenario);

    game.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 8), new units.RomanHeavyInfantry());

    assertEquals(GameStatus.ONGOING, scenario.gameStatus(game));
});

test("place units on board", () => {
    const scenario = new ScenarioRaceToOppositeSide();
    const board = new Board();

    scenario.placeUnitsOn(board);

    assertEquals(5, board.unitsOfSide(Side.ROMAN).length);
    assertEquals(6, board.unitsOfSide(Side.CARTHAGINIAN).length);
});
