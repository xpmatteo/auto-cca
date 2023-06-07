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