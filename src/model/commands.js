import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "./events.js";

const DISTANCE_VALUE_BACKOFF = 0.9;

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

export class CloseCombatCommand {
    constructor(toHex, fromHex) {
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Close Combat from ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        const attackingUnit = game.unitAt(this.fromHex);
        if (!attackingUnit) {
            throw new Error(`No unit at ${this.fromHex}`);
        }
        const defendingUnit = game.unitAt(this.toHex);
        if (!defendingUnit) {
            throw new Error(`No unit at ${this.toHex}`);
        }
        if (attackingUnit.side === defendingUnit.side) {
            throw new Error(`Cannot attack own unit at ${this.toHex}`);
        }
        if (this.toHex === this.fromHex) {
            throw new Error(`Cannot attack self at ${this.toHex}`);
        }
        if (this.toHex.distance(this.fromHex) > 1) {
            throw new Error(`Cannot Close Combat with unit at ${this.toHex} from ${this.fromHex} (too far)`);
        }
        let events = [];
        const diceResults = game.roll(attackingUnit.diceCount);
        const damage = defendingUnit.takeDamage(diceResults);
        events.push(new DamageEvent(this.toHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);
        if (defendingUnit.isDead()) {
            game.killUnit(this.toHex);
            events.push(new UnitKilledEvent(this.toHex, defendingUnit));
        } else {
            // battle back
            const battleBackDice = game.roll(defendingUnit.diceCount);
            const battleBackDamage = attackingUnit.takeDamage(battleBackDice);
            events.push(new BattleBackEvent(this.fromHex, this.toHex, battleBackDice.length));
            events.push(new DamageEvent(this.fromHex, battleBackDamage, battleBackDice));
            if (attackingUnit.isDead()) {
                game.killUnit(this.fromHex);
                events.push(new UnitKilledEvent(this.fromHex, attackingUnit));    
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

