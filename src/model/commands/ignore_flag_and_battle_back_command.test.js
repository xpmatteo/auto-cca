import makeGame from "../game.js";
import { hexOf } from "../../lib/hexlib.js";
import { RESULT_HEAVY, RESULT_SWORDS } from "../dice.js";
import { BattleBackEvent, DamageEvent } from "../events.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../units.js";
import { IgnoreFlagAndBattleBackCommand } from "./abstract_combat_command.js";


test('execute command', () => {
    const game = makeGame(new NullScenario(), { roll(numberOfDice) { return [RESULT_HEAVY, RESULT_SWORDS]; } });
    const battlingBackUnit = new RomanLightInfantry();
    const originalAttacker = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(0, 0), battlingBackUnit);
    game.placeUnit(hexOf(1, 1), originalAttacker);
    const command = new IgnoreFlagAndBattleBackCommand(hexOf(0, 0), hexOf(1,1));

    const gameEvents = command.play(game);

    expect(gameEvents.toString()).toEqual([
        new BattleBackEvent(hexOf(1, 1), hexOf(0, 0), 2),
        new DamageEvent(battlingBackUnit, originalAttacker, hexOf(1, 1), 1, [RESULT_HEAVY, RESULT_SWORDS]),
    ].toString());
});
