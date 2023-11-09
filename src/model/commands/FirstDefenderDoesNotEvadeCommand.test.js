import { hexOf } from "../../lib/hexlib.js";
import { diceReturning, RESULT_LEADER, RESULT_LIGHT } from "../dice.js";
import { eventNames } from "../events.js";
import makeGame from "../game.js";
import { BattlePhase } from "../phases/BattlePhase.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianLightInfantry, RomanHeavyInfantry, RomanLightInfantry } from "../units.js";
import { Command } from "./commands.js";
import { FirstDefenderDoesNotEvadeCommand } from "./FirstDefenderDoesNotEvadeCommand.js";


describe('1st defender does not evade', () => {
    test('it continues to close combat', () => {
        const attackerDice = [RESULT_LIGHT].concat(Array(4).fill(RESULT_LEADER));
        const defenderDice = Array(2).fill(RESULT_LEADER);
        const game = makeGame(new NullScenario(), diceReturning(attackerDice.concat(defenderDice)))
        const defendingUnit = new CarthaginianLightInfantry();
        const attackingUnit = new RomanHeavyInfantry();
        const defendingHex = hexOf(2,2);
        game.placeUnit(defendingHex, defendingUnit);
        const attackingHex = hexOf(2,3);
        game.placeUnit(attackingHex, attackingUnit);
        game.phases = [new FirstDefenderEvasionPhase(null, null, null, null), new BattlePhase()];
        const command = new FirstDefenderDoesNotEvadeCommand(defendingHex, attackingHex);

        const gameEvents = command.play(game);

        expect(eventNames(gameEvents)).toEqual([
            "DamageEvent",
            "BattleBackEvent",
            "DamageEvent",
            ]);
        expect(game.currentPhase.toString()).toBe("battle");
    });
});
