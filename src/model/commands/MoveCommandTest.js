import {assertAlmostEquals, assertDeepEquals, assertEquals, test} from "../../lib/test_lib.js";
import makeGame, {MovementTrail} from "../game.js";
import {NullScenario} from "../scenarios.js";
import {CarthaginianHeavyInfantry, RomanHeavyInfantry} from "../units.js";
import {hexOf} from "../../lib/hexlib.js";
import {MoveCommand} from "./moveCommand.js";

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


test("value of MoveCommand at various distances", () => {
    let game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());

    // distance 1
    assertAlmostEquals(0.2 * 250 - 0.04 * 250, new MoveCommand(hexOf(0, 1), hexOf(0, 2)).value(game));

    // distance 3: moving away from enemy gives negative score
    assertAlmostEquals(0.2 * 0.2 * 0.2 * 250 - 0.04 * 250, new MoveCommand(hexOf(0, 3), hexOf(0, 2)).value(game));
});

test("value of MoveCommand with weaker target", () => {
    let game = makeGame(new NullScenario());
    const unit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());
    game.takeDamage(unit, 3);

    // distance 1
    assertAlmostEquals(0.2 * 1000 - 0.04 * 1000, new MoveCommand(hexOf(0, 1), hexOf(0, 2)).value(game));

    // distance 3: moving away from enemy gives negative score
    assertAlmostEquals(0.2 * 0.2 * 0.2 * 1000 - 0.04 * 1000, new MoveCommand(hexOf(0, 3), hexOf(0, 2)).value(game));
});

test("value of move command, 3 same-distance enemies of different strengths", () => {
    let game = makeGame(new NullScenario());
    const fromHex = hexOf(0, 0);
    const toHex = hexOf(0, 1);
    game.placeUnit(fromHex, new CarthaginianHeavyInfantry());
    placeEnemyUnit(hexOf(1, 1), 4);
    placeEnemyUnit(hexOf(0, 2), 2);
    placeEnemyUnit(hexOf(-1, 2), 1);

    const command = new MoveCommand(toHex, fromHex);

    assertAlmostEquals(0.2 * 1000 - 0.04 * 1000, command.value(game));

    function placeEnemyUnit(hex, desiredStrength) {
        assertEquals(2, hex.distance(fromHex), `distance fromHex of unit at ${hex}`);
        assertEquals(1, hex.distance(toHex), `distance fromHex of unit at ${hex}`);
        const enemyUnit = new RomanHeavyInfantry();
        game.placeUnit(hex, enemyUnit);
        game.takeDamage(enemyUnit, 4-desiredStrength);
    }
});

