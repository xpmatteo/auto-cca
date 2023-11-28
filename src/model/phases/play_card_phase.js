import { CARD_IMAGE_SIZE } from "../../config.js";
import { MAP_HEIGHT } from "../../view/map.js";
import { makePlayCardCommand } from "../commands/play_card_command.js";
import { Phase } from "./Phase.js";

const EMPTY_SET = new Set();

export class PlayCardPhase extends Phase {
    constructor() {
        super("play one card");
    }

    validCommands(game) {
        return [...game.hand()].
            filter(card => card.eligibleUnits(game).length > 0).
            map(card => makePlayCardCommand(card));
    }

    hilightedHexes(game) {
        return EMPTY_SET;
    }

    logCommands(game) {
        game.validCommands().forEach((c, i) => console.log(i, c.toString()));
    }

    onClick(hex, game, pixel) {
        if (pixel.y < MAP_HEIGHT || pixel.y > MAP_HEIGHT + CARD_IMAGE_SIZE.y) {
            return undefined;
        }
        const index = Math.trunc(pixel.x / CARD_IMAGE_SIZE.x);
        if (index >= game.handSouth.length) {
            return undefined;
        }
        return makePlayCardCommand(game.handSouth.at(index));
    }

    requiresDeepThought() {
        return true;
    }
}
