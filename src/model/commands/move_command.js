import {valueOfHexOverAllEnemyUnits} from "./commands.js";

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

    isDeterministic() {
        return true;
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
        // if we are weak, better run away
        if (game.unitStrength(movingUnit) === 1) {
            return valueOfFromHex - valueOfToHex;
        }
        return valueOfToHex - valueOfFromHex;
    }
}