import { hexOf } from "../lib/hexlib.js";
import { ORDER_3_LEFT_CARD, ORDER_HEAVY_TROOPS_CARD, ORDER_LIGHT_TROOPS_CARD } from "../model/cards.js";
import { makeMoveCommand } from "../model/commands/move_command.js";
import makeGame from "../model/game.js";
import { MovementPhase } from "../model/phases/MovementPhase.js";
import { NullScenario } from "../model/scenarios.js";
import { Side } from "../model/side.js";
import { RomanHeavyInfantry, RomanLightInfantry } from "../model/units.js";
import { GreedyPlayer } from "./greedy_player.js";
import { scoreGreedy } from "./score.js";


/**
 * @param {Game} game
 * @param {Card} card
 * @returns {number}
 */
function cardEvaluation(game, card) {
    if (card === ORDER_3_LEFT_CARD) {
        return 3;
    }
    if (card === ORDER_HEAVY_TROOPS_CARD) {
        return 2;
    }
    if (card === ORDER_LIGHT_TROOPS_CARD) {
        return 1;
    }
}

test('Greedy player chooses a card', () => {
    const player = new GreedyPlayer(cardEvaluation);
    const game = makeGame(new NullScenario());
    game.handSouth = [ORDER_3_LEFT_CARD, ORDER_HEAVY_TROOPS_CARD, ORDER_LIGHT_TROOPS_CARD];
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new RomanLightInfantry());

    const result = player.decideMove(game);

    expect(result.toString()).toBe("PlayCard(Order Three Units Left)");
});

test("greedy_player", function() {
    const player = new GreedyPlayer();
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(2, 1), new RomanHeavyInfantry()); // one hex away
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry()); // has support
    game.placeUnit(hexOf(1, 0), new RomanHeavyInfantry()); // has support
    game.placeUnit(hexOf(0, 1), new RomanHeavyInfantry()); // has support
    expect(scoreGreedy(game, Side.ROMAN)).toBe(3);
    game.foreachUnit((unit, hex) => game.orderUnit(hex))
    game.phases = [new MovementPhase(game)]

    const result = player.decideMove(game);

    // the best move is to move the one separate unit close to its friends, so that
    // we get one additional supported unit
    expect(result.toString()).toEqual(makeMoveCommand(hexOf(1, 1), hexOf(2, 1)).toString());
});
