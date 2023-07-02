export class OrderUnitCommand {
    constructor(hex) {
        this.hex = hex;
    }

    toString() {
        return `OrderUnit(${this.hex})`;
    }

    play(game) {
        game.orderUnit(this.hex);
        return [];
    }

    isDeterministic() {
        return true;
    }

    value(game) {
        return 1;
    }
}