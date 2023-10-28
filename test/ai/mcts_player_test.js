import { MctsPlayer } from "ai/mcts_player.js";
import * as fs from "fs";
import makeGame from "model/game.js";
import { NullScenario, TwoOnTwoMeleeScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "model/units.js";
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
    expect(rootAsString).toBe(`955/2000: undefined -> Roman play one card -> 1
 955/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  955/1999: End phase -> Roman movement -> 1
   955/1998: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/138: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     13/13: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      7/7: Retreat [1,5] to [0,6] -> Roman battle -> 2
      6/6: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -24/43: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      24/43: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -5/23: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      -2/12: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -3/11: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -12/12: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      12/12: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     -4/22: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/22: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     24/24: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      12/12: Retreat [1,5] to [0,6] -> Roman battle -> 2
      12/12: Retreat [1,5] to [1,6] -> Roman battle -> 2
    CHANCE/27: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -18/26: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      18/26: Retreat [0,4] to [1,3] -> Roman battle -> 1
    CHANCE/1834: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     -35/734: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      35/734: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     -104/155: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      104/155: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     724/944: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      482/607: Retreat [0,5] to [0,6] -> Roman battle -> 1
      242/337: Retreat [0,5] to [-1,6] -> Roman battle -> 1\n`);
});

test('close combat from light to heavy', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 3), new RomanLightInfantry());

    const root = player.search(game, 30);

    const rootAsString = root.toString(7);
    expect(rootAsString).toBe(`-24/30: undefined -> Roman play one card -> 1
 -24/30: PlayCard(Order Light Troops) -> Roman order 1 light units -> 1
  -24/29: End phase -> Roman movement -> 1
   -23/28: MacroCommand(Move [2,3] to [3,2]) -> Roman battle -> 1
    CHANCE/27: Close Combat from [3,2] to [2,2] -> Roman battle -> 5
     0/2: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
      0/2: Retreat [2,2] to [2,1] -> Roman battle -> 1
       1/1: End phase -> Carthaginian play one card -> 0
      0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
     -8/10: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -3/3: Retreat [3,2] to [1,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -3/3: Retreat [3,2] to [3,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -2/4: Retreat [3,2] to [2,4] -> Roman battle -> 1
       1/3: End phase -> Carthaginian play one card -> 1
     -3/3: Close Combat from [3,2] to [2,2] -> Roman battle -> 1
      3/3: End phase -> Carthaginian play one card -> 1
       2/2: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 1
     -8/8: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -3/3: Retreat [3,2] to [1,4] -> Roman battle -> 1
       2/2: End phase -> Carthaginian play one card -> 1
      -3/3: Retreat [3,2] to [2,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -2/2: Retreat [3,2] to [3,4] -> Roman battle -> 1
       2/2: End phase -> Carthaginian play one card -> 1
     2/3: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
      -2/3: Retreat [2,2] to [3,1] -> Roman battle -> 1
       2/2: End phase -> Carthaginian play one card -> 1
      0/0: Retreat [2,2] to [2,1] -> Roman battle -> 0\n`);
});
