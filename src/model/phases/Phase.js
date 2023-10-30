
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

    /**
     * @param {Game} game
     */
    validCommands(game) {
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

    /**
     * @param {Hex} hex
     * @param {InteractiveGame} game
     * @returns {[GameEvent]}
     */
    onClick(hex, interactiveGame) {
        let events = [];
        if (interactiveGame.selectedUnit() && interactiveGame.hilightedHexes.has(hex)) {
            const command = interactiveGame.validCommands().
                find(command => command.toHex === hex && command.fromHex === interactiveGame.selectedHex());
            events = interactiveGame.executeCommand(command);
            interactiveGame.deselectUnit();
        } else if (!interactiveGame.selectedUnit() && interactiveGame.hilightedHexes.has(hex)) {
            interactiveGame.selectUnit(interactiveGame.unitAt(hex));
        } else {
            interactiveGame.deselectUnit();
        }
        return events;
    }

    requiresDeepThought() {
        return false;
    }

    /**
     * @param {Game} game
     * @returns {void}
     */
    executePreliminaryOperations(game) {
        // do nothing
    }

    /**
     * @param {Game} game
     * @returns {Set<Hex>}
     */
    hilightedHexes(game) {
        throw new Error("Abstract method");
    }
}
