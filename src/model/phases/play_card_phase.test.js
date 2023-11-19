import { hexOf } from "../../lib/hexlib.js";
import { ORDER_HEAVY_TROOPS_CARD, ORDER_LIGHT_TROOPS_CARD } from "../cards.js";
import { PlayCardCommand } from "../commands/play_card_command.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { RomanHeavyInfantry, RomanLightInfantry } from "../units.js";
import { PlayCardPhase } from "./play_card_phase.js";

/**
 * @param {PlayCardCommand} playCardCommand
 * @returns {string}
 */
function cardName(playCardCommand) {
    return playCardCommand.card.constructor.name;
}

test('it returns one command for every card', () => {
    const phase = new PlayCardPhase();
    const game = makeGame(new NullScenario());
    game.handSouth = [ORDER_HEAVY_TROOPS_CARD, ORDER_LIGHT_TROOPS_CARD]
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new RomanLightInfantry());

    const validCommands = phase.validCommands(game);

    expect(validCommands.map(cardName)).toStrictEqual(["OrderHeavyTroopsCard", "OrderLightTroopsCard"]);
});

test('it skips cards that have no eligible units', () => {
    const phase = new PlayCardPhase();
    const game = makeGame(new NullScenario());
    game.handSouth = [ORDER_HEAVY_TROOPS_CARD, ORDER_LIGHT_TROOPS_CARD]
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());

    const validCommands = phase.validCommands(game);

    expect(validCommands.map(cardName)).toStrictEqual(["OrderHeavyTroopsCard"]);
});
