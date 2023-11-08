import { Hex } from "../../lib/hexlib.js";

export class Phase {
    temporarySide;
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
     * @param {InteractiveGame} interactiveGame
     * @returns {Command|undefined}
     */
    onClick(hex, interactiveGame) {
        if (interactiveGame.selectedUnit() && interactiveGame.hilightedHexes.has(hex)) {
            const command = this.validCommands(interactiveGame.toGame()).
                find(command => command.toHex === hex && command.fromHex === interactiveGame.selectedHex());
            interactiveGame.deselectUnit();
            return command;
        }

        if (!interactiveGame.selectedUnit() && interactiveGame.hilightedHexes.has(hex)) {
            interactiveGame.selectUnit(interactiveGame.unitAt(hex));
        } else {
            interactiveGame.deselectUnit();
        }
        return undefined;
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
     * @param {InteractiveGame} game
     * @returns {Set<Hex>}
     */
    hilightedHexes(game) {
        throw new Error("Abstract method");
    }
}
