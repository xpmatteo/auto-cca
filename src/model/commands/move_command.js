import { Hex } from "../../lib/hexlib.js";
import { Command } from "./commands.js";

export class MoveCommand extends Command {
    static #constructionAllowed = false;

    constructor(toHex, fromHex) {
        super();
        if (!MoveCommand.#constructionAllowed) {
            throw new Error("Must use factory method makeMoveCommand");
        }
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

    /**
     * @param {Hex} toHex
     * @param {Hex} fromHex
     * @returns {MoveCommand}
     */
    static make(toHex, fromHex) {
        if (!MOVE_COMMANDS.has(toHex)) {
            MOVE_COMMANDS.set(toHex, new Map());
        }
        MoveCommand.#constructionAllowed = true;
        if (!MOVE_COMMANDS.get(toHex).has(fromHex)) {
            MOVE_COMMANDS.get(toHex).set(fromHex, new MoveCommand(toHex, fromHex));
        }
        MoveCommand.#constructionAllowed = false;
        return MOVE_COMMANDS.get(toHex).get(fromHex);
    }
}

/** @type {Map<Hex, Map<Hex, MoveCommand>>} */
const MOVE_COMMANDS = new Map();

export function makeMoveCommand(toHex, fromHex) {
    return MoveCommand.make(toHex, fromHex);
}
