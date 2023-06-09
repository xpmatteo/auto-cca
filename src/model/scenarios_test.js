import { assertEquals, test } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { Board } from "./board.js";
import * as units from "./units.js";
import * as GameStatus from "./game_status.js";
import { Side } from "./side.js";
import { ScenarioRaceToOppositeSide } from "./scenarios.js";

const scenario = new ScenarioRaceToOppositeSide();

test ("first side", () => {
    assertEquals(Side.ROMAN, scenario.firstSide);
});

test("roman win", () => {
    let board = new Board();

    board.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    board.placeUnit(hexOf(1, 0), new units.RomanHeavyInfantry());

    assertEquals(GameStatus.ROMAN_WIN, scenario.gameStatus(board));
});

test("carthaginian win", () => {
    let board = new Board();

    board.placeUnit(hexOf(1, 7), new units.CarthaginianHeavyInfantry());
    board.placeUnit(hexOf(1, 8), new units.CarthaginianHeavyInfantry());

    assertEquals(GameStatus.CARTHAGINIAN_WIN, scenario.gameStatus(board));
});

test("ongoing", () => {
    let board = new Board();

    board.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    board.placeUnit(hexOf(1, 8), new units.RomanHeavyInfantry());

    assertEquals(GameStatus.ONGOING, scenario.gameStatus(board));
});

test("place units on board", () => {
    const scenario = new ScenarioRaceToOppositeSide();
    const board = new Board();

    scenario.placeUnitsOn(board);

    assertEquals(5, board.unitsOfSide(Side.ROMAN).length);
    assertEquals(3, board.unitsOfSide(Side.CARTHAGINIAN).length);
});