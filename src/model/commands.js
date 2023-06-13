import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "./events.js";

const DISTANCE_VALUE_BACKOFF = 0.9;

export class MoveCommand {
    constructor(to, from) {
        this.to = to;
        this.from = from;
    }

    toString() {
        return `Move ${this.from} to ${this.to}`;
    }

    play(game) {
        game.moveUnit(this.to, this.from);
        game.markUnitSpent(game.unitAt(this.to));
        game.addMovementTrail(this.to, this.from);
        return [];
    }

    value(game) {
        const movingUnit = game.unitAt(this.fromHex);
        const enemyUnitHex = game.closestUnitHex(this.toHex, game.opposingSide(movingUnit.side));
        const enemyUnit = game.unitAt(enemyUnitHex);
        const distance = enemyUnitHex.distance(this.fromHex);
        return hexScore(enemyUnit) * Math.pow(DISTANCE_VALUE_BACKOFF, distance);
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
        const diceResults = game.roll(attackingUnit.diceCount());
        const damage = defendingUnit.takeDamage(diceResults);
        events.push(new DamageEvent(this.toHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);
        if (defendingUnit.isDead()) {
            game.killUnit(this.toHex);
            events.push(new UnitKilledEvent(this.toHex, defendingUnit));
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

