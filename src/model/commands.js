import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "./events.js";
import * as dice from './dice.js';
import { RetreatPhase } from "./phases.js";
import { hexOf } from "../lib/hexlib.js";

const DISTANCE_VALUE_BACKOFF = 0.2;

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
        const movingUnit = game.unitAt(this.fromHex);
        if (!movingUnit) {
            throw new Error(`No unit at ${this.fromHex}`);
        }
        
        const enemyUnitHex = game.closestUnitHex(this.toHex, game.opposingSide(movingUnit.side));
        const enemyUnit = game.unitAt(enemyUnitHex);
        if (!enemyUnit) {
            throw new Error(`No enemy unit at ${enemyUnitHex}`);
        }
        // we don't want to move to a hex that is worse than the hex we are moving from
        const valueOfFromHex = valueOfHex(this.fromHex, enemyUnitHex, enemyUnit);
        const valueOfToHex = valueOfHex(this.toHex, enemyUnitHex, enemyUnit);
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

function valueOfHex(hexToBeEvaluated, enemyUnitHex, enemyUnit) {
    const distance = enemyUnitHex.distance(hexToBeEvaluated);
    return hexScore(enemyUnit) * Math.pow(DISTANCE_VALUE_BACKOFF, distance);
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
        const damage = defendingUnit.takeDamage(diceResults, game.retreatHexes(defendingHex).length === 0);
        events.push(new DamageEvent(defendingHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);

        if (defendingUnit.isDead()) {
            game.killUnit(defendingHex);
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (game.retreatHexes(defendingHex).length !== 0 && diceResults.includes(dice.RESULT_FLAG)) {
            const retreatHexes = game.retreatHexes(defendingHex);
            game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, retreatHexes));
        } else {
            // battle back
            const battleBackDice = game.roll(defendingUnit.diceCount);
            const battleBackDamage = attackingUnit.takeDamage(battleBackDice);
            events.push(new BattleBackEvent(attackingHex, defendingHex, battleBackDice.length));
            events.push(new DamageEvent(attackingHex, battleBackDamage, battleBackDice));
            if (attackingUnit.isDead()) {
                game.killUnit(attackingHex);
                events.push(new UnitKilledEvent(attackingHex, attackingUnit));    
            }
        }
        return events;
    }

    value(game) {
        const defendingUnit = game.unitAt(this.toHex);
        return hexScore(defendingUnit);
    }
}

function hexScore(enemyUnit) {
    return 1000 / enemyUnit.strength;
}

