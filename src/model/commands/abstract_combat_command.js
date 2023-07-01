
export class AbstractCombatCommand {
    constructor() {
        if (this.constructor === AbstractCombatCommand) {
            throw new Error("AbstractCombatCommand is abstract");
        }
    }

    validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex) {
        if (!attackingUnit) {
            throw new Error(`No unit at ${attackingHex}`);
        }
        if (!defendingUnit) {
            throw new Error(`No unit at ${defendingHex}`);
        }
        if (attackingUnit.side === defendingUnit.side) {
            throw new Error(`Cannot attack own unit at ${defendingHex}`);
        }
        if (defendingHex === attackingHex) {
            throw new Error(`Cannot attack self at ${defendingHex}`);
        }
    }

}