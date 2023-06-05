import { Side } from './side.js';

export class Unit {
    #imageName;
    #side;

    constructor(imageName, side) {
        this.#imageName = imageName;
        this.#side = side;
    }

    get imageName() {
        return this.#imageName;
    }

    get side() {
        return this.#side;
    }

    movementDestinations(fromHex, board) {
        let hexes = board.subtractOffMap(fromHex.neighbors());
        return board.subtractOccupiedHexes(hexes);
    }
}


export class RomanHeavyInfantry extends Unit {
    constructor() {
        super('rom_inf_hv.png', Side.ROMAN);
    }
}

export class CarthaginianHeavyInfantry extends Unit {
    constructor() {
        super('car_inf_hv.png', Side.CARTHAGINIAN);
    }
}