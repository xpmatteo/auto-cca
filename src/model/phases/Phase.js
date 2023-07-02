
export class Phase {
    #name;
    constructor(name) {
        this.#name = name;
        if (new.target === Phase) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    toString() {
        return this.#name;
    }

    validCommands(turn, board) {
        return [];
    }

    hilightedHexesForDirectionalCommands(game) {
        if (game.selectedUnit()) {
            const toHexes = game.validCommands().
            filter(command => command.fromHex === game.selectedHex()).
                map(command => command.toHex).
                filter(hex => hex !== undefined);
            return new Set(toHexes);
        }
        const fromHexes = game.validCommands().
            map(command => command.fromHex).
            filter(hex => hex !== undefined);
        return new Set(fromHexes);
    }
}
