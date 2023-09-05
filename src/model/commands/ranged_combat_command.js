import { AbstractCombatCommand } from "./abstract_combat_command.js";

export class RangedCombatCommand extends AbstractCombatCommand {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Ranged Combat from ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        const defendingHex = this.toHex;
        const attackingHex = this.fromHex;
        const attackingUnit = game.unitAt(attackingHex);
        const defendingUnit = game.unitAt(defendingHex);
        this.validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex);
        const distance = defendingHex.distance(attackingHex);
        if (distance < 2 || distance > attackingUnit.range) {
            throw new Error(`Cannot Ranged Combat with unit at ${defendingHex} from ${attackingHex}`);
        }
        game.markUnitSpent(attackingUnit);
        return this.attack(attackingUnit, defendingHex, defendingUnit, game);
    }

    decideDiceCount(attackingUnit, game) {
        return game.unitHasMoved(this.fromHex) ? 1 : 2;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        return false;
    }
}
