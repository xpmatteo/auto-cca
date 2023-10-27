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
    expect(rootAsString).toBe(`1255/2000: undefined -> Roman play one card -> 1
 1255/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  1255/1999: End phase -> Roman movement -> 79
   20/30: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/4: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -3/3: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      3/3: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/27: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/9: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/9: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     7/7: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      3/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   20/29: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/10: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/10: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -3/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      3/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   42/51: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/7: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -6/6: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      6/6: Retreat [0,4] to [1,3] -> Roman battle -> 1
    CHANCE/45: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -9/13: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      9/13: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     10/10: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      5/5: Retreat [1,5] to [0,6] -> Roman battle -> 1
      5/5: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      7/7: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     6/8: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      6/6: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   11/21: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -3/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      3/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/17: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -1/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      1/5: Retreat [1,4] to [2,3] -> Roman battle -> 1
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   -2/9: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/2: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     3/5: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -3/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/3: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -1/2: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
      -1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
   5/17: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/8: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -2/7: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      -1/3: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      -1/4: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
    CHANCE/10: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      3/3: Retreat [1,4] to [2,3] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   7/19: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
    CHANCE/7: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     1/5: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -1/5: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     1/1: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [0,5] to [-1,6] -> Roman battle -> 0
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
    CHANCE/7: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     0/6: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      1/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      -1/3: Retreat [0,5] to [0,6] -> Roman battle -> 1
   18/27: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/3: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      2/2: Retreat [0,4] to [1,3] -> Roman battle -> 1
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
    CHANCE/19: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     3/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     5/12: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      4/8: Retreat [0,5] to [0,6] -> Roman battle -> 1
   22/29: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/24: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      7/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
     -2/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   21/30: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/26: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     16/25: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      7/11: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      9/14: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
    CHANCE/5: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   22/29: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/7: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/6: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      5/6: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/23: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     -5/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      5/7: Retreat [1,4] to [1,3] -> Roman battle -> 1
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   5/16: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/11: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     0/10: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      1/7: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      -1/3: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 1
     -2/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/3: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
    CHANCE/3: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
   4/14: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/5: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/2: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -1/1: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      1/1: Retreat [0,4] to [0,3] -> Roman battle -> 0
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/9: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     5/5: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -5/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
     -1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   19/28: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/26: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     16/25: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      7/11: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
      9/14: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
    CHANCE/3: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   6/18: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/11: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     2/10: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      1/5: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
      1/5: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
    CHANCE/8: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      2/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   13/23: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/8: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     3/7: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      2/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      1/3: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/13: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     6/8: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      5/5: Retreat [0,5] to [0,6] -> Roman battle -> 1
     2/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   23/31: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -8/10: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      8/10: Retreat [1,4] to [1,3] -> Roman battle -> 1
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/7: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -6/6: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      6/6: Retreat [0,4] to [1,3] -> Roman battle -> 1
   19/27: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/23: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -4/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      4/8: Retreat [1,4] to [2,3] -> Roman battle -> 1
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   22/37: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/9: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -4/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
    CHANCE/25: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     3/6: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      1/3: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     5/16: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/7: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      3/9: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -3/3: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      3/3: Retreat [0,4] to [1,3] -> Roman battle -> 1
   38/46: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/37: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -15/18: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      15/18: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     4/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/7: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
    CHANCE/10: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -9/9: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      9/9: Retreat [0,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
   1/13: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/11: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -2/10: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      -2/2: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      0/8: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
    CHANCE/3: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   19/27: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/23: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      4/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   27/35: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -6/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      6/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     -3/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   9/19: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/12: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/5: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/8: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     1/7: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      -1/3: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      2/4: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
   9/20: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/8: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     4/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -1/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/7: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     1/6: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      -1/6: Retreat [0,4] to [0,3] -> Roman battle -> 1
   22/30: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/26: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     4/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      4/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   7/19: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/11: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     3/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/9: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -1/8: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      0/5: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      -1/3: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
   11/21: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/9: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
    CHANCE/13: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     4/12: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      4/8: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
      0/4: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
   3/14: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/9: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     0/5: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      -1/2: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      1/3: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
   18/26: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/22: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/9: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/9: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      2/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   18/26: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/22: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
   17/28: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     -1/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/2: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/10: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     3/9: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      1/5: Retreat [0,5] to [0,6] -> Roman battle -> 1
      2/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/16: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     9/12: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      4/5: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      5/7: Retreat [0,5] to [0,6] -> Roman battle -> 1
     2/3: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      1/1: Retreat [0,5] to [0,6] -> Roman battle -> 1
   19/27: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/24: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/9: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/9: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     7/7: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      3/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/4: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -3/3: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      3/3: Retreat [0,4] to [0,3] -> Roman battle -> 1
   5/15: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/10: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     4/6: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -4/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
     -1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/2: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -1/1: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      1/1: Retreat [0,4] to [0,3] -> Roman battle -> 0
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   9/19: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/4: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [0,5] to [-1,6] -> Roman battle -> 0
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
    CHANCE/9: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     4/8: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      0/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
      4/6: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/8: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   3/15: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/5: Close Combat from [1,5] to [1,4] -> Roman battle -> 3
     0/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      -1/3: Retreat [1,4] to [2,3] -> Roman battle -> 1
    CHANCE/7: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     2/6: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      0/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/4: Retreat [0,5] to [0,6] -> Roman battle -> 1
   13/23: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/8: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     3/7: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      2/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      1/3: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/13: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     6/8: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      5/5: Retreat [0,5] to [0,6] -> Roman battle -> 1
     2/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   15/25: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/9: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -1/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      1/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
    CHANCE/15: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     7/14: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      4/7: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      3/7: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/3: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   11/17: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     3/5: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      3/3: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
      0/2: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
    CHANCE/12: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/5: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   27/35: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -6/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      6/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     -3/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   6/16: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/3: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      2/2: Retreat [1,4] to [2,3] -> Roman battle -> 1
    CHANCE/14: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     3/13: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      1/7: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      2/6: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
   31/37: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/33: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     9/9: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      5/5: Retreat [1,5] to [0,6] -> Roman battle -> 1
      4/4: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -6/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      6/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     5/7: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      5/5: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      4/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      4/4: Retreat [0,4] to [1,3] -> Roman battle -> 1
   14/24: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/15: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     7/14: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      4/7: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      3/7: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/7: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     2/3: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      1/1: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -1/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   13/25: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/8: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     1/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/17: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     11/16: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      11/12: Retreat [0,5] to [0,6] -> Roman battle -> 1
      0/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/2: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      1/1: Retreat [1,4] to [2,3] -> Roman battle -> 0
   24/32: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/28: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     4/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      4/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
     7/7: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      3/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   17/27: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      4/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/22: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/9: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      4/9: Retreat [1,4] to [2,3] -> Roman battle -> 1
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   17/26: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 3
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/20: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     10/19: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      4/8: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
      6/11: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
   39/46: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/9: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -8/8: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      8/8: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/38: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     6/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      3/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -10/10: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      10/10: Retreat [1,4] to [1,3] -> Roman battle -> 1
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -3/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -6/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      6/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   27/35: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -6/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      6/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     -3/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   15/24: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/5: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -2/4: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      2/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 3
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      1/1: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/14: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     3/5: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
     3/6: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [0,5] to [0,6] -> Roman battle -> 1
      -1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   27/33: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/7: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -6/6: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      6/6: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/27: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -8/12: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      8/12: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   12/21: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/15: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     8/14: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      7/9: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
      1/5: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   34/38: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/34: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -6/6: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      6/6: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     8/8: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      4/4: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      7/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
     6/8: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      6/6: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      4/4: Retreat [0,4] to [1,3] -> Roman battle -> 1
   22/29: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/24: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      7/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
     -2/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   13/23: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/8: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     3/7: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      2/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      1/3: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/13: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     6/8: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      5/5: Retreat [0,5] to [0,6] -> Roman battle -> 1
     2/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   15/24: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/7: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     0/4: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      0/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
     0/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/16: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -2/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/3: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/3: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      2/2: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   9/20: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/8: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     4/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -1/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/7: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     1/6: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      -1/6: Retreat [0,4] to [0,3] -> Roman battle -> 1
   23/31: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -8/10: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      8/10: Retreat [1,4] to [1,3] -> Roman battle -> 1
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/7: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -6/6: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      6/6: Retreat [0,4] to [1,3] -> Roman battle -> 1
   25/32: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/7: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/6: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      5/6: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/26: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     -5/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      5/7: Retreat [1,4] to [1,3] -> Roman battle -> 1
     4/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      4/4: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     6/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      3/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -5/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      5/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   22/30: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      7/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
     -2/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   17/26: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/22: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     -3/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
   18/27: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/15: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     3/5: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
     4/7: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      5/5: Retreat [0,5] to [0,6] -> Roman battle -> 1
      -1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/5: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -2/4: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      2/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/9: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      2/2: Retreat [1,4] to [2,3] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   7/17: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/4: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -3/3: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      3/3: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/14: Close Combat from [1,5] to [1,4] -> Roman battle -> 3
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/9: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/9: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   3/14: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/9: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [2,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     0/5: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      -1/2: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      1/3: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
   11/21: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/13: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     2/8: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -2/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/3: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -2/2: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      2/2: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/7: Close Combat from [1,5] to [1,4] -> Roman battle -> 3
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   9/20: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/17: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     -3/11: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      3/11: Retreat [1,4] to [1,3] -> Roman battle -> 1
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/4: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -3/3: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
      3/3: Retreat [0,4] to [1,3] -> Roman battle -> 1
   21/31: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/17: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     -2/8: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      2/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
     3/4: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      2/2: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -4/4: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/8: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -4/7: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      4/7: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/8: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   17/27: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
      4/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
    CHANCE/22: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/9: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      4/9: Retreat [1,4] to [2,3] -> Roman battle -> 1
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   22/31: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/26: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      7/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   7/17: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/9: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     2/8: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      2/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/4: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     0/2: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      0/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
     -1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/6: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     -2/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   6/16: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/6: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     1/5: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      -1/1: Retreat [0,5] to [0,6] -> Roman battle -> 1
      2/4: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [0,5] to [-1,6] -> Roman battle -> 0
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
    CHANCE/8: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   22/30: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/25: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -7/7: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      7/7: Retreat [1,4] to [2,3] -> Roman battle -> 1
     -2/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
   20/28: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/5: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -4/4: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      4/4: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/24: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     3/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     0/2: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -4/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      4/8: Retreat [1,4] to [1,3] -> Roman battle -> 1
     5/5: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      3/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      2/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
     -3/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      3/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   3/14: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/6: Close Combat from [1,5] to [1,4] -> Roman battle -> 3
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/4: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -1/3: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      0/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      -1/1: Retreat [0,5] to [0,6] -> Roman battle -> 1
    CHANCE/6: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     0/0: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 0
     1/3: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -1/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     1/2: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      1/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
   8/20: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/11: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     0/0: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      2/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     3/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      1/2: Retreat [1,5] to [1,6] -> Roman battle -> 1
    CHANCE/10: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     0/9: Close Combat from [-1,5] to [0,4] -> Roman retreat -> 2
      1/6: Retreat [-1,5] to [-2,6] -> Roman battle -> 1
      -1/3: Retreat [-1,5] to [-1,6] -> Roman battle -> 1
   3/15: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/6: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     0/4: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      0/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/7: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     0/6: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      -1/1: Retreat [0,5] to [0,6] -> Roman battle -> 1
      1/5: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/4: Close Combat from [1,5] to [1,4] -> Roman battle -> 4
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/1: Retreat [1,5] to [0,6] -> Roman battle -> 0
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   19/29: MacroCommand(Move [-1,6] to [-1,5],Move [0,6] to [1,5]) -> Roman battle -> 2
    CHANCE/6: Close Combat from [-1,5] to [0,4] -> Roman battle -> 1
     -5/5: Close Combat from [-1,5] to [0,4] -> Carthaginian retreat -> 2
      5/5: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/24: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -4/4: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      4/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -4/8: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [1,3] -> Roman battle -> 0
      4/8: Retreat [1,4] to [2,3] -> Roman battle -> 1
     2/6: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/3: Retreat [1,5] to [0,6] -> Roman battle -> 1
      0/3: Retreat [1,5] to [1,6] -> Roman battle -> 1
   16/25: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/4: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -3/3: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      3/3: Retreat [0,4] to [0,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [1,3] -> Roman battle -> 0
    CHANCE/9: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     2/2: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      0/0: Retreat [0,5] to [0,6] -> Roman battle -> 0
     -2/4: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/4: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -2/2: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      2/2: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/14: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     0/0: Close Combat from [1,5] to [1,4] -> Roman retreat -> 0
     -4/5: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      4/5: Retreat [1,4] to [1,3] -> Roman battle -> 1
     0/4: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      1/3: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
   23/32: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/11: Close Combat from [1,5] to [1,4] -> Roman battle -> 5
     1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     2/2: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      0/0: Retreat [1,5] to [1,6] -> Roman battle -> 0
     -2/3: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      2/3: Retreat [1,4] to [1,3] -> Roman battle -> 1
     3/3: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      2/2: Retreat [1,5] to [0,6] -> Roman battle -> 2
      1/1: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -1/1: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/20: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     13/19: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      6/10: Retreat [0,5] to [0,6] -> Roman battle -> 1
      7/9: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/3: Close Combat from [0,5] to [1,4] -> Roman battle -> 2
     -1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -1/1: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      1/1: Retreat [1,4] to [1,3] -> Roman battle -> 0
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0\n`);
});

test('close combat from light to heavy', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 3), new RomanLightInfantry());

    const root = player.search(game, 30);

    const rootAsString = root.toString(7);
    expect(rootAsString).toBe(`-6/30: undefined -> Roman play one card -> 1
 -6/30: PlayCard(Order Light Troops) -> Roman order 1 light units -> 1
  -6/29: End phase -> Roman movement -> 4
   0/5: MacroCommand(Move [2,3] to [3,3]) -> Roman battle -> 1
    CHANCE/5: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 3
     0/0: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 0
     0/1: Ranged Combat from [3,3] to [2,2] -> Carthaginian retreat -> 2
      0/1: Retreat [2,2] to [2,1] -> Roman battle -> 0
      0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
     1/3: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 1
      -1/3: End phase -> Carthaginian play one card -> 1
       0/2: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 1
   -1/9: MacroCommand(Move [2,3] to [3,3]) -> Roman battle -> 1
    CHANCE/9: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 3
     -2/6: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 1
      2/6: End phase -> Carthaginian play one card -> 1
       2/5: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 1
     1/1: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 1
      -1/1: End phase -> Carthaginian play one card -> 0
     0/1: Ranged Combat from [3,3] to [2,2] -> Carthaginian retreat -> 2
      0/1: Retreat [2,2] to [2,1] -> Roman battle -> 0
      0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
   -1/11: MacroCommand(Move [2,3] to [3,3]) -> Roman battle -> 1
    CHANCE/11: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 3
     0/1: Ranged Combat from [3,3] to [2,2] -> Carthaginian retreat -> 2
      0/1: Retreat [2,2] to [2,1] -> Roman battle -> 0
      0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
     -3/7: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 1
      3/7: End phase -> Carthaginian play one card -> 1
       4/6: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 1
     2/2: Ranged Combat from [3,3] to [2,2] -> Roman battle -> 1
      -2/2: End phase -> Carthaginian play one card -> 1
       -1/1: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 0
   -3/3: MacroCommand(Move [2,3] to [3,2]) -> Roman battle -> 1
    CHANCE/2: Close Combat from [3,2] to [2,2] -> Roman battle -> 2
     0/0: Close Combat from [3,2] to [2,2] -> Roman retreat -> 0
     -1/1: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -1/1: Retreat [3,2] to [1,4] -> Roman battle -> 0
      0/0: Retreat [3,2] to [2,4] -> Roman battle -> 0
      0/0: Retreat [3,2] to [3,4] -> Roman battle -> 0\n`);
});
