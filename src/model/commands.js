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
    }
}