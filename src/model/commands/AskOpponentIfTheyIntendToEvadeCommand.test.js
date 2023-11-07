import { hexOf } from "../../lib/hexlib.js";
import makeGame from "../game.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { NullScenario } from "../scenarios.js";
import { RomanLightInfantry } from "../units.js";
import { AskOpponentIfTheyIntendToEvadeCommand } from "./AskOpponentIfTheyIntendToEvadeCommand.js";

describe('ask opponent if they intend to evade: a command', () => {
    const command = new AskOpponentIfTheyIntendToEvadeCommand(hexOf(2,2), hexOf(2,1));
    test('it changes the current phase', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(2,2), new RomanLightInfantry());

        command.play(game);

        expect(game.currentPhase).toEqual(new FirstDefenderEvasionPhase([
            hexOf(0, 4), hexOf(1, 4), hexOf(2, 4)], hexOf(2,2), hexOf(2,1)));
    });
});

