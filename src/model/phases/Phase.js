
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
}
