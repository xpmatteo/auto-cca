import { Hex } from "../../lib/hexlib.js";
import { RESULT_LIGHT } from "../dice.js";
import { BattleBackEvent, GameEvent } from "../events.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";


export class IgnoreFlagAndBattleBackCommand extends AbstractCombatCommand {
    /**
     * @param {Hex} battleBackHex
     * @param {Hex} originalAttackerHex
     */
    constructor(battleBackHex, originalAttackerHex) {
        super();
        this.battleBackHex = battleBackHex;
        this.originalAttackerHex = originalAttackerHex;
    }

    toString() {
        return `Ignore Flag and Battle Back from ${this.battleBackHex} to ${this.originalAttackerHex}`;
    }

    play(game) {
        const battleBackUnit = game.unitAt(this.battleBackHex);
        const originalAttacker = game.unitAt(this.originalAttackerHex);
        /** @type {GameEvent[]} */
        let events = [];

        events.push(new BattleBackEvent(this.originalAttackerHex, this.battleBackHex, battleBackUnit.diceCount));
        events = events.concat(this.attack(battleBackUnit, this.originalAttackerHex, originalAttacker, game));
        return events;
    }

    decideDiceCount(attackingUnit, game) {
        return attackingUnit.diceCount;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        return attackingUnit.weight != RESULT_LIGHT;
    }
}
