
import { assertEquals, assertDeepEquals, test, xtest } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { CloseCombatCommand, EndPhaseCommand, RetreatCommand, MoveCommand } from "./commands.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "./units.js";
import { MovementTrail } from "./turn.js";
import { Side } from "./side.js";
import { RetreatPhase } from "./phases.js";

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


test("Retreat play", () => {
    let game = makeGame(new NullScenario());     
    let unit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    assertEquals("Roman movement", game.currentPhaseName);
    game.unshiftPhase(new RetreatPhase(Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]))
    assertEquals("Carthaginian retreat", game.currentPhaseName);

    game.executeCommand(new RetreatCommand(hexOf(1,4), hexOf(1, 5)));

    assertEquals("Roman movement", game.currentPhaseName);
    assertEquals(undefined, game.unitAt(hexOf(1, 5)));
    assertEquals(unit, game.unitAt(hexOf(1, 4)));
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

test("value of MoveCommand at various distances", () => {
    let game = makeGame(new NullScenario());     
    game.placeUnit(hexOf(0, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());
    
    // distance 1
    assertEquals(22.5, new MoveCommand(hexOf(0, 1), hexOf(0, 2)).value(game));

    // distance 3: moving away from enemy gives negative score
    assertEquals(-20.24999999999997, new MoveCommand(hexOf(0, 3), hexOf(0, 2)).value(game));
});

test("value of move command, pathological case", () => {
    let game = makeGame(new NullScenario());     
    game.placeUnit(hexOf(1, 4), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 5), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 5), new CarthaginianHeavyInfantry());

    game.placeUnit(hexOf(2, 5), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 6), new RomanHeavyInfantry());
    game.placeUnit(hexOf(0, 6), new RomanHeavyInfantry());
    game.placeUnit(hexOf(4, 4), new RomanHeavyInfantry());

    assertEquals(22.5, new MoveCommand(hexOf(2, 4), hexOf(1, 4)).value(game));
});

