import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "../events.js";
import * as dice from '../dice.js';
import { RetreatPhase } from "../phases/RetreatPhase.js";
import { hexOf } from "../../lib/hexlib.js";

const DISTANCE_VALUE_BACKOFF = 0.2;

/*
    Commands are immutable objects representing the actions that can be taken by the player. 
    They are used by both the human player and the AI to execute a move.
*/

function hexScore(enemyUnitStrength) {
    return 1000 / enemyUnitStrength;
}

function valueOfHex(hexToBeEvaluated, enemyUnitHex, enemyUnitStrength) {
    const distance = enemyUnitHex.distance(hexToBeEvaluated);
    return hexScore(enemyUnitStrength) * Math.pow(DISTANCE_VALUE_BACKOFF, distance);
}

function valueOfHexOverAllEnemyUnits(game, hexToBeEvaluated, friendlySide) {
    let bestValue = -Infinity;
    game.foreachUnit((otherUnit, otherUnitHex) => {
        if (otherUnit.side === friendlySide) {
            return;
        }
        const candidateBest = valueOfHex(otherUnitHex, hexToBeEvaluated, game.unitStrength(otherUnit));
        if (candidateBest > bestValue) {
            bestValue = candidateBest;
        }
    });
    return bestValue;
}

export class MoveCommand {
    constructor(toHex, fromHex) {
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Move ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.markUnitSpent(game.unitAt(this.toHex));
        game.addMovementTrail(this.toHex, this.fromHex);
        return [];
    }

    value(game) {     
        // The value of a move is the value of the hex we are moving to,
        // minus the value of the hex we are moving from.
        // The value of a hex is determined by the closest, weakest enemy unit, 
        // and decreases with the distance from that unit.

        const movingUnit = game.unitAt(this.fromHex);
        if (!movingUnit) {
            throw new Error(`No unit at ${this.fromHex}`);
        }
        
        // for all enemy units, find the highest value using the ValueOfHex function
        const valueOfToHex = valueOfHexOverAllEnemyUnits(game, this.toHex, movingUnit.side);
        const valueOfFromHex = valueOfHexOverAllEnemyUnits(game, this.fromHex, movingUnit.side);

        // we don't want to move to a hex that is worse than the hex we are moving from
        return valueOfToHex - valueOfFromHex;
    }
}

export class RetreatCommand {
    constructor(toHex, fromHex) {
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.markUnitSpent(game.unitAt(this.toHex));
        game.addMovementTrail(this.toHex, this.fromHex);
        game.shiftPhase();
        return [];
    }

    toString() {
        return `Retreat ${this.fromHex} to ${this.toHex}`;
    }

    value(game) {
        return 0; // AI treats all retreat hexes as equally likely
    }
}

export class EndPhaseCommand {
    toString() {
        return `End phase`;
    }

    play(game) {
        game.endPhase();
        return [];
    }

    value(game) {
        return 0;
    }
}

function countOf(array, value) {
    return array.filter(v => v === value).length;
}

export class CloseCombatCommand {
    constructor(toHex, fromHex) {
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Close Combat from ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        const defendingHex = this.toHex;
        const attackingHex = this.fromHex;
        const attackingUnit = game.unitAt(attackingHex);
        if (!attackingUnit) {
            throw new Error(`No unit at ${attackingHex}`);
        }
        const defendingUnit = game.unitAt(defendingHex);
        if (!defendingUnit) {
            throw new Error(`No unit at ${defendingHex}`);
        }
        if (attackingUnit.side === defendingUnit.side) {
            throw new Error(`Cannot attack own unit at ${defendingHex}`);
        }
        if (defendingHex === attackingHex) {
            throw new Error(`Cannot attack self at ${defendingHex}`);
        }
        if (defendingHex.distance(attackingHex) > 1) {
            throw new Error(`Cannot Close Combat with unit at ${defendingHex} from ${attackingHex} (too far)`);
        }
        let events = [];
        const diceResults = game.roll(attackingUnit.diceCount);
        const damage = game.takeDamage(defendingHex, diceResults, game.retreatHexes(defendingHex).length === 0);
        events.push(new DamageEvent(defendingHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);

        if (game.isDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (game.retreatHexes(defendingHex).length !== 0 && diceResults.includes(dice.RESULT_FLAG)) {
            const retreatHexes = game.retreatHexes(defendingHex);
            game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, retreatHexes));
        } else {
            // battle back
            const battleBackDice = game.roll(defendingUnit.diceCount);
            const battleBackDamage = game.takeDamage(attackingUnit, battleBackDice);
            events.push(new BattleBackEvent(attackingHex, defendingHex, battleBackDice.length));
            events.push(new DamageEvent(attackingHex, battleBackDamage, battleBackDice));
            if (game.isDead(attackingUnit)) {
                events.push(new UnitKilledEvent(attackingHex, attackingUnit));    
            }
        }
        return events;
    }

    value(game) {
        const defendingUnit = game.unitAt(this.toHex);
        return hexScore(game.unitStrength(defendingUnit));
    }
}


