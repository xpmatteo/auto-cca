import { CARD_IMAGE_SIZE } from "../../config.js";
import { Phase } from "./Phase.js";
import { makePlayCardCommand } from "../commands/play_card_command.js";
import { MAP_HEIGHT } from "../../view/map.js";

const EMPTY_SET = new Set();

export class PlayCardPhase extends Phase {
    constructor() {
        super("play one card");
    }

    validCommands(game) {
        return game.hand().
            filter(card => card.eligibleUnits(game).length > 0).
            map(card => makePlayCardCommand(card));
    }

    hilightedHexes(game) {
        return EMPTY_SET;
    }

    onClick(hex, game, pixel) {
        if (pixel.y < MAP_HEIGHT || pixel.y > MAP_HEIGHT + CARD_IMAGE_SIZE.y) {
            return [];
        }
        const index = Math.trunc(pixel.x / CARD_IMAGE_SIZE.x);
        const commands = game.validCommands();
        if (index >= commands.length) {
            return undefined;
        }
        return commands[index];
    }

    requiresDeepThought() {
        return true;
    }
}
