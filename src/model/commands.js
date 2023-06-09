import { DamageEvent, BattleBackEvent } from "./events.js";

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
    }
}

export class EndPhaseCommand {
    toString() {
        return `End phase`;
    }

    play(game) {
        game.endPhase();
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
        const diceResults = game.roll(attackingUnit.diceCount());
        const damage = defendingUnit.takeDamage(diceResults);
        return [
            new DamageEvent(this.toHex, damage, diceResults),
            new BattleBackEvent(this.fromHex, this.toHex, defendingUnit.diceCount())
        ]
    }
}

