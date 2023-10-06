import { OrderHeavyTroopsCard, OrderLightTroopsCard } from "model/cards.js";
import makeGame from "model/game.js";
import { PlayCardPhase } from "model/phases/play_card_phase.js";
import { NullScenario } from "model/scenarios.js";
import { RomanHeavyInfantry, RomanLightInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";

test('it returns one command for every card', () => {
    const phase = new PlayCardPhase();
    const game = makeGame(new NullScenario());
    game.handSouth = [new OrderHeavyTroopsCard(), new OrderLightTroopsCard()]
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new RomanLightInfantry());

    expect(phase.validCommands(game, null).length).toBe(2);
});
