import { fixedRandom, resetFixedRandom } from "../lib/random.js";
import makeGame from "../model/game.js";
import { TwoOnTwoMeleeScenario } from "../model/scenarios.js";
import { OpenLoopMctsPlayer } from "./OpenLoopMctsPlayer.js";

describe('OpenLoopMctsPlayer', () => {
    const originalRandom = Math.random;
    beforeEach(() => {
        resetFixedRandom();
        Math.random = fixedRandom;
    });

    afterEach(() => {
        Math.random = originalRandom;
    });

    const player = new OpenLoopMctsPlayer({
        expansionFactor: 2.1415,
        playoutIterations: 20,
        logfunction: () => {},
    });

    test('2 on 2', () => {
        const game = makeGame(new TwoOnTwoMeleeScenario());

        const root = player.search(game, 1);

        const rootAsString = root.toString();
        console.log(rootAsString);
        expect(rootAsString).toMatchSnapshot();
    });

});
