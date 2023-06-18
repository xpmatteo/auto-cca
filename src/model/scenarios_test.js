import { assertEquals, test } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { Board } from "./board.js";
import * as units from "./units.js";
import * as GameStatus from "./game_status.js";
import { Side } from "./side.js";
import { TestScenario } from "./scenarios.js";
import makeGame from "./game.js";

const scenario = new TestScenario();

test ("first side", () => {
    assertEquals(Side.ROMAN, scenario.firstSide);
});

test("roman win", () => {
    let game = makeGame(scenario);
    game.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(3, 0), new units.CarthaginianHeavyInfantry());

    game.takeDamage(hexOf(1, 0), 4);
    game.takeDamage(hexOf(2, 0), 4);
    game.takeDamage(hexOf(3, 0), 4);

    assertEquals(GameStatus.ROMAN_WIN, scenario.gameStatus(game));
});

test("carthaginian win", () => {
    let game = makeGame(scenario);
    game.placeUnit(hexOf(1, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(3, 0), new units.RomanHeavyInfantry());

    game.takeDamage(hexOf(1, 0), 4);
    game.takeDamage(hexOf(2, 0), 4);
    game.takeDamage(hexOf(3, 0), 4);

    assertEquals(GameStatus.CARTHAGINIAN_WIN, scenario.gameStatus(game));
});

test("ongoing", () => {
    let game = makeGame(scenario);

    game.placeUnit(hexOf(1, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 8), new units.RomanHeavyInfantry());

    assertEquals(GameStatus.ONGOING, scenario.gameStatus(game));
});

