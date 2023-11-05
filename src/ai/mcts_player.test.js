import { MctsPlayer } from "./mcts_player.js";
import * as fs from "fs";
import makeGame from "../model/game.js";
import { MeleeScenario, NullScenario, TwoOnTwoMeleeScenario } from "../model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../model/units.js";
import { hexOf } from "../lib/hexlib.js";
import { fixedRandom, resetFixedRandom } from "../lib/random.js";

/**
 * @param {string} fileName
 */
function dumpTreeToFile(root, fileName) {
    const logger = fs.createWriteStream(fileName, {
        flags: 'w'
    });
    function write(str) {
        logger.write(str);
        logger.write("\n");
    }
    root.dumpTree(write);
}

const originalRandom = Math.random;
beforeEach(() => {
    resetFixedRandom();
    Math.random = fixedRandom;
});

afterEach(() => {
    Math.random = originalRandom;
});

const player = new MctsPlayer({
    expansionFactor: 2.1415,
    playoutIterations: 20,
    logfunction: () => {},
});

// fails bc I don't know
xtest('2 on 2', () => {
    const game = makeGame(new TwoOnTwoMeleeScenario());

    const root = player.search(game, 2000);

    const rootAsString = root.toString(6);
    expect(rootAsString).toMatchSnapshot();
});

// disabled bc of bug in simulation of battle back after ignored flags
xtest('melee', () => {
    const game = makeGame(new MeleeScenario());

    const root = player.search(game, 2000);

    const rootAsString = root.toString(6);
    expect(rootAsString).toMatchSnapshot();
});

// disabled bc of evasion phase is not yet implemented
xtest('close combat from light to heavy', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 3), new RomanLightInfantry());

    const root = player.search(game, 30);

    const rootAsString = root.toString(7);
    expect(rootAsString).toMatchSnapshot();
});
