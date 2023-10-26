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

    const rootAsString = root.toString(6);
    expect(rootAsString).toBe(`722/2000: undefined -> Roman play one card -> 1
 722/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  722/1999: End phase -> Roman movement -> 1
   722/1998: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman movement -> 1
    721/1997: End phase -> Roman battle -> 3
     CHANCE/980: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
      25/625: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -227/235: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -53/119: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
     CHANCE/832: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
      86/95: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      -316/345: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      81/96: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      -86/118: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      -81/82: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      17/95: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
     CHANCE/186: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
      -109/185: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2\n`);
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

        const root = player.search(game, 30);

        const rootAsString = root.toString(7);
        expect(rootAsString).toBe(`-27/30: undefined -> Roman play one card -> 1
 -27/30: PlayCard(Order Light Troops) -> Roman order 1 light units -> 1
  -27/29: End phase -> Roman movement -> 1
   -26/28: MacroCommand(Move [2,3] to [3,2]) -> Roman movement -> 1
    -25/27: End phase -> Roman battle -> 1
     CHANCE/26: Close Combat from [3,2] to [2,2] -> Roman battle -> 5
      -5/5: Close Combat from [3,2] to [2,2] -> Roman battle -> 1
       5/5: End phase -> Carthaginian play one card -> 1
      0/2: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
       0/2: Retreat [2,2] to [2,1] -> Roman battle -> 1
       0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
      -5/5: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
       -2/2: Retreat [3,2] to [2,4] -> Roman battle -> 1
       -2/2: Retreat [3,2] to [3,4] -> Roman battle -> 1
       -1/1: Retreat [3,2] to [1,4] -> Roman battle -> 1
      -9/9: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
       -3/3: Retreat [3,2] to [1,4] -> Roman battle -> 1
       -3/3: Retreat [3,2] to [3,4] -> Roman battle -> 1
       -3/3: Retreat [3,2] to [2,4] -> Roman battle -> 1
      4/4: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
       -4/4: Retreat [2,2] to [3,1] -> Roman battle -> 1
       0/0: Retreat [2,2] to [2,1] -> Roman battle -> 0\n`);
    });
});
