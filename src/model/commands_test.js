
import { assertEquals, assertDeepEquals, test, xtest } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { CloseCombatCommand, EndPhaseCommand, MoveCommand } from "./commands.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "./units.js";
import { MovementTrail } from "./turn.js";
import { Side } from "./side.js";

test("MoveCommand play", () => {
    let game = makeGame(new NullScenario());     
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);

    game.executeCommand(new MoveCommand(hexOf(1,4), hexOf(1, 5)));

    assertEquals(undefined, game.unitAt(hexOf(1, 5)));
    assertEquals(unit, game.unitAt(hexOf(1, 4)));
    assertDeepEquals([unit], game.spentUnits);
    assertDeepEquals([new MovementTrail(hexOf(1, 4), hexOf(1, 5))], game.movementTrails);
});


test("CloseCombatCommand play", () => {
    let game = makeGame(new NullScenario());     
    let unit = new RomanHeavyInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.placeUnit(hexOf(1, 4), target);

    game.executeCommand(new CloseCombatCommand(hexOf(1,4), hexOf(1, 5)));

    assertDeepEquals([unit], game.spentUnits);
});

test("value of EndPhaseCommand is zero", () => {
    let game = makeGame(new NullScenario());     
    let command = new EndPhaseCommand();

    assertEquals(0, command.value(game));
});

test("value of CloseCombatCommand", () => {
    let game = makeGame(new NullScenario());     
    let attacker = new RomanHeavyInfantry();
    let defender = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 4), defender);
    let command = new CloseCombatCommand(hexOf(1, 4), hexOf(1, 5));
    assertEquals(Side.ROMAN, game.currentSide)

    // value is 1000 / defender strength
    assertEquals(250, command.value(game));
});

xtest("value of MoveCommand at various distances", () => {
    let game = makeGame(new NullScenario());     
    let attacker = new RomanHeavyInfantry();
    let defender = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 3), defender);
    
    // distance 0: value is 0.9 * (1000/defender strength)
    assertEquals(0.9 * 250, new MoveCommand(hexOf(1, 4), hexOf(1, 3)).value(game));

    // distance 1: value is 0.9 * 0.9 * (1000/defender strength)
    // assertEquals(0.9 * 0.9 * 250, new MoveCommand(hexOf(0, 5), hexOf(1, 3).value(game)));

    // // distance 2: value is 0.9 * 0.9 * 0.9 * (1000/defender strength)
    // assertEquals(0.9 * 0.9 * 0.9 * 250, new MoveCommand(hexOf(1, 6), hexOf(1, 3).value(game)));
});

xtest("value of MoveCommand with more than one enemy unit adjacent", () => {
});
