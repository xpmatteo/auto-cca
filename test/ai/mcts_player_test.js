import * as fs from "fs";
import { DecisionNode, MctsPlayer } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard, OrderLightTroopsCard } from "model/cards.js";
import { CloseCombatCommand } from "model/commands/close_combat_command.js";
import { PlayCardCommand } from "model/commands/play_card_command.js";
import { RangedCombatCommand } from "model/commands/ranged_combat_command.js";
import makeGame from "model/game.js";
import { AkragasScenario, MeleeScenario, NullScenario, TwoOnTwoMeleeScenario } from "model/scenarios.js";
import {
    CarthaginianHeavyInfantry,
    CarthaginianMediumInfantry,
    RomanHeavyInfantry,
    RomanLightInfantry
} from "model/units.js";
import { hexOf } from "xlib/hexlib.js";
import { fixedRandom, resetFixedRandom } from "xlib/random.js";

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

test('2 on 2', () => {
    const game = makeGame(new TwoOnTwoMeleeScenario());

    const root = player.search(game, 2000);

    const rootAsString = root.toString(3);
    expect(rootAsString).toBe(`812/2000: undefined -> Roman play one card -> 1
 812/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  812/1999: End phase -> Roman movement -> 11
   24/109: Move [-1,6] to [0,5] -> Roman movement -> 6
   44/148: Move [0,6] to [-1,7] -> Roman movement -> 6
   -4/46: Move [0,6] to [1,6] -> Roman movement -> 7
   -5/42: End phase -> Roman battle -> 1
   100/240: Move [0,6] to [1,5] -> Roman movement -> 7
   11/81: Move [0,6] to [0,7] -> Roman movement -> 7
   -1/56: Move [-1,6] to [-2,7] -> Roman movement -> 7
   502/852: Move [0,6] to [0,5] -> Roman movement -> 6
   138/305: Move [-1,6] to [-1,5] -> Roman movement -> 7
   5/68: Move [-1,6] to [-1,7] -> Roman movement -> 6
   -2/51: Move [-1,6] to [-2,6] -> Roman movement -> 7\n`);
});


test('light movement size', () => {
    const game = makeGame(new TwoOnTwoMeleeScenario());
    // game.handSouth = [new OrderLightTroopsCard()];

    // player.args.expansionFactor = 100;
    const root = player.search(game, 20000);
    //dumpTreeToFile(root, 'tree.txt');
    console.log(root.size());
    const rootAsString = root.toString(5).split("\n").filter(line => line.includes('CHANCE')).join("\n");
    console.log("branching", root.branchingFactor());
    console.log(rootAsString);
});


describe('Non deterministic results', () => {

    test('close combat from light to heavy', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(2, 3), new RomanLightInfantry());

        const root = player.search(game, 1000);

        const rootAsString = root.toString(3);
        expect(rootAsString).toBe(`-304/1000: undefined -> Roman play one card -> 1
 -304/1000: PlayCard(Order Light Troops) -> Roman order 1 light units -> 1
  -304/999: End phase -> Roman movement -> 17
   -20/44: Move [2,3] to [1,4] -> Roman movement -> 1
   -17/18: Move [2,3] to [1,3] -> Roman movement -> 1
   -20/64: Move [2,3] to [4,2] -> Roman movement -> 1
   -20/59: Move [2,3] to [0,4] -> Roman movement -> 1
   -15/108: Move [2,3] to [3,4] -> Roman movement -> 1
   -12/128: Move [2,3] to [4,3] -> Roman movement -> 1
   -19/70: Move [2,3] to [2,4] -> Roman movement -> 1
   -18/21: End phase -> Roman battle -> 1
   -20/58: Move [2,3] to [3,3] -> Roman movement -> 1
   -17/19: Move [2,3] to [1,2] -> Roman movement -> 1
   -17/18: Move [2,3] to [3,1] -> Roman movement -> 1
   -17/17: Move [2,3] to [3,2] -> Roman movement -> 1
   -17/94: Move [2,3] to [2,5] -> Roman movement -> 1
   -20/45: Move [2,3] to [0,3] -> Roman movement -> 1
   -18/81: Move [2,3] to [0,5] -> Roman movement -> 1
   -16/99: Move [2,3] to [1,5] -> Roman movement -> 1
   -20/55: Move [2,3] to [4,1] -> Roman movement -> 1\n`);
    });
});
