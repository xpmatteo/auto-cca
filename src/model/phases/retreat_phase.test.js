import { hexOf } from "../../lib/hexlib.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import makeGame, { MovementTrail } from "../game.js";
import { IgnoreFlagAndBattleBackCommand } from "../commands/abstract_combat_command.js";
import { NullScenario } from "../scenarios.js";
import { Side } from "../side.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../units.js";
import { BattlePhase } from "./BattlePhase.js";
import { RetreatPhase } from "./RetreatPhase.js";


test("Retreat play", () => {
    let game = makeGame(new NullScenario());
    let retreatingUnit = new CarthaginianHeavyInfantry();
    let attackingUnit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), retreatingUnit);
    game.phases = [new RetreatPhase(hexOf(7,7), Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]), new BattlePhase()]

    game.executeCommand(new RetreatCommand(hexOf(1,4), hexOf(1, 5)));

    expect(game.currentPhaseName).toEqual("Roman battle");
    expect(game.unitAt(hexOf(1, 5))).toEqual(undefined);
    expect(game.unitAt(hexOf(1, 4))).toEqual(retreatingUnit);
    expect(game.movementTrails).toEqual([new MovementTrail(hexOf(1, 4), hexOf(1, 5))]);
});

test('retreat phase valid commands', () => {
    const retreatPhase = new RetreatPhase(hexOf(2,2), Side.CARTHAGINIAN, hexOf(0,0), [hexOf(0,0), hexOf(1, 1)]);

    retreatPhase.validCommands(makeGame(new NullScenario()));

    expect(retreatPhase.validCommands(makeGame(new NullScenario())).toString()).toEqual([
        new IgnoreFlagAndBattleBackCommand(hexOf(0,0), hexOf(2,2)),
        new RetreatCommand(hexOf(1,1), hexOf(0,0)),
    ].toString());
});
