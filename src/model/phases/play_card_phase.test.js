import makeGame from "../game.js";
import { OrderHeavyTroopsCard, OrderLightTroopsCard } from "../cards.js";
import { PlayCardPhase } from "./play_card_phase.js";
import { NullScenario } from "../scenarios.js";
import { RomanHeavyInfantry, RomanLightInfantry } from "../units.js";
import { hexOf } from "../../lib/hexlib.js";
import { PlayCardCommand } from "../commands/play_card_command.js";

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
    game.handSouth = [new OrderHeavyTroopsCard(), new OrderLightTroopsCard()]
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new RomanLightInfantry());

    const validCommands = phase.validCommands(game, null);

    expect(validCommands.map(cardName)).toStrictEqual(["OrderHeavyTroopsCard", "OrderLightTroopsCard"]);
});

test('it skips cards that have no eligible units', () => {
    const phase = new PlayCardPhase();
    const game = makeGame(new NullScenario());
    game.handSouth = [new OrderHeavyTroopsCard(), new OrderLightTroopsCard()]
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());

    const validCommands = phase.validCommands(game, null);

    expect(validCommands.map(cardName)).toStrictEqual(["OrderHeavyTroopsCard"]);
});
