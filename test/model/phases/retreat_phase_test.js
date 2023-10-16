import { NullScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry } from "model/units.js";
import makeGame, { MovementTrail } from "model/game.js";
import { hexOf } from "xlib/hexlib.js";
import { RetreatCommand } from "model/commands/retreatCommand.js";
import { Side } from "model/side.js";
import { RetreatPhase } from "model/phases/RetreatPhase.js";
import { BattlePhase } from "model/phases/BattlePhase.js";


test("Retreat play", () => {
    let game = makeGame(new NullScenario());
    let unit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.phases = [new RetreatPhase(Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]), new BattlePhase()]

    game.executeCommand(new RetreatCommand(hexOf(1,4), hexOf(1, 5)));

    expect(game.currentPhaseName).toEqual("Roman battle");
    expect(game.unitAt(hexOf(1, 5))).toEqual(undefined);
    expect(game.unitAt(hexOf(1, 4))).toEqual(unit);
    expect(game.movementTrails).toEqual([new MovementTrail(hexOf(1, 4), hexOf(1, 5))]);
});

