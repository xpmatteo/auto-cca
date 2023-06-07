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
        game.switchSide();
    }
}

export class AttackCommand {
    constructor(to, from) {
        this.to = to;
        this.from = from;
    }

    toString() {
        return `Attack from ${this.from} to ${this.to}`;
    }

    play(game) {
        const attackingUnit = game.unitAt(this.from);
        if (!attackingUnit) {
            throw new Error(`No unit at ${this.from}`);
        }
        const defendingUnit = game.unitAt(this.to);
        if (!defendingUnit) {
            throw new Error(`No unit at ${this.to}`);
        }
        if (attackingUnit.side === defendingUnit.side) {
            throw new Error(`Cannot attack own unit at ${this.to}`);
        }
        const diceResults = game.roll(attackingUnit.diceCount());
        const damage = defendingUnit.takeDamage(diceResults);
        return [
            new DamageEvent(this.to, damage, diceResults),
            new BattleBackEvent(this.from, this.to, defendingUnit.diceCount())
        ]
    }
}