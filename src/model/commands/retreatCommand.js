
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

    isDeterministic() {
        return true;
    }
}