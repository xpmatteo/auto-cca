import makeGame, { MovementTrail } from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";
import { MoveCommand } from "model/commands/move_command.js";

test("MoveCommand play", () => {
    let game = makeGame(new NullScenario());
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);

    game.executeCommand(new MoveCommand(hexOf(1, 4), hexOf(1, 5)));

    expect(game.unitAt(hexOf(1, 5))).toEqual(undefined);
    expect(game.unitAt(hexOf(1, 4))).toEqual(unit);
    expect(game.spentUnits).toEqual([unit]);
    expect(game.movementTrails).toEqual([new MovementTrail(hexOf(1, 4), hexOf(1, 5))]);
});


test("value of MoveCommand at various distances", () => {
    let game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());

    // distance 1
    expect(new MoveCommand(hexOf(0, 1), hexOf(0, 2)).value(game)).toBeCloseTo(0.2 * 250 - 0.04 * 250, 0.0000001);

    // distance 3: moving away from enemy gives negative score
    expect(new MoveCommand(hexOf(0, 3), hexOf(0, 2)).value(game)).toBeCloseTo(0.2 * 0.2 * 0.2 * 250 - 0.04 * 250, 0.0000001);
});

test("value of MoveCommand with weaker target", () => {
    let game = makeGame(new NullScenario());
    const unit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());
    game.takeDamage(unit, 3);

    // distance 1
    expect(new MoveCommand(hexOf(0, 1), hexOf(0, 2)).value(game)).toBeCloseTo(0.2 * 1000 - 0.04 * 1000, 0.0000001);

    // distance 3: moving away from enemy gives negative score
    expect(new MoveCommand(hexOf(0, 3), hexOf(0, 2)).value(game)).toBeCloseTo(0.2 * 0.2 * 0.2 * 1000 - 0.04 * 1000, 0.0000001);
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

    expect(command.value(game)).toBeCloseTo(0.2 * 1000 - 0.04 * 1000, 0.0000001);

    function placeEnemyUnit(hex, desiredStrength) {
        expect(hex.distance(fromHex)).toEqual(2);
        expect(hex.distance(toHex)).toEqual(1);
        const enemyUnit = new RomanHeavyInfantry();
        game.placeUnit(hex, enemyUnit);
        game.takeDamage(enemyUnit, 4 - desiredStrength);
    }
});

