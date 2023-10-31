import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry } from "../units.js";
import makeGame, { MovementTrail } from "../game.js";
import { hexOf } from "../../lib/hexlib.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import { Side } from "../side.js";
import { RetreatPhase } from "./RetreatPhase.js";
import { BattlePhase } from "./BattlePhase.js";


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

