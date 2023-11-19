import makeGame, { MovementTrail } from "../game.js";
import { NullScenario } from "../scenarios.js";
import { RomanHeavyInfantry } from "../units.js";
import { hexOf } from "../../lib/hexlib.js";
import { makeMoveCommand } from "../commands/move_command.js";

test("MoveCommand play", () => {
    let game = makeGame(new NullScenario());
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);

    game.executeCommand(makeMoveCommand(hexOf(1, 4), hexOf(1, 5)));

    expect(game.unitAt(hexOf(1, 5))).toEqual(undefined);
    expect(game.unitAt(hexOf(1, 4))).toEqual(unit);
    expect(game.spentUnits).toEqual([unit]);
    expect(game.movementTrails).toEqual([new MovementTrail(hexOf(1, 4), hexOf(1, 5))]);
});

test('MoveCommand creation', () => {
    const makeMoveCommand1 = makeMoveCommand(hexOf(1, 2), hexOf(1, 3));
    const makeMoveCommand2 = makeMoveCommand(hexOf(1, 2), hexOf(1, 3));

    expect(makeMoveCommand1).toBe(makeMoveCommand2);
});
