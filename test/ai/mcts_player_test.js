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
    expect(rootAsString).toBe(`1271/2000: undefined -> Roman play one card -> 1
 1271/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  1271/1999: End phase -> Roman movement -> 1
   1271/1998: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/26: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     -22/25: Close Combat from [0,5] to [0,4] -> Carthaginian retreat -> 2
      22/25: Retreat [0,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [0,4] to [0,3] -> Roman battle -> 0
    CHANCE/1790: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     132/150: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      66/75: Retreat [1,5] to [0,6] -> Roman battle -> 2
      66/75: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -351/522: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
      351/522: Retreat [1,4] to [1,3] -> Roman battle -> 1
     -220/220: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      220/220: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     274/399: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      287/372: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -13/27: Retreat [1,5] to [1,6] -> Roman battle -> 2
     92/115: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -92/115: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     359/383: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      180/192: Retreat [1,5] to [0,6] -> Roman battle -> 2
      179/191: Retreat [1,5] to [1,6] -> Roman battle -> 2
    CHANCE/183: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     -32/54: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      -16/27: Retreat [0,5] to [-1,6] -> Roman battle -> 1
      -16/27: Retreat [0,5] to [0,6] -> Roman battle -> 1
     -16/16: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      16/16: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     19/112: Close Combat from [0,5] to [1,4] -> Roman retreat -> 2
      11/59: Retreat [0,5] to [0,6] -> Roman battle -> 1
      8/53: Retreat [0,5] to [-1,6] -> Roman battle -> 1\n`);
});

test('close combat from light to heavy', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 3), new RomanLightInfantry());

    const root = player.search(game, 30);

    const rootAsString = root.toString(7);
    expect(rootAsString).toBe(`-26/30: undefined -> Roman play one card -> 1
 -26/30: PlayCard(Order Light Troops) -> Roman order 1 light units -> 1
  -26/29: End phase -> Roman movement -> 1
   -25/28: MacroCommand(Move [2,3] to [3,2]) -> Roman battle -> 1
    CHANCE/27: Close Combat from [3,2] to [2,2] -> Roman battle -> 5
     -7/7: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -3/3: Retreat [3,2] to [1,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -2/2: Retreat [3,2] to [2,4] -> Roman battle -> 1
       2/2: End phase -> Carthaginian play one card -> 1
      -2/2: Retreat [3,2] to [3,4] -> Roman battle -> 1
       1/1: End phase -> Carthaginian play one card -> 0
     -3/3: Close Combat from [3,2] to [2,2] -> Roman battle -> 1
      3/3: End phase -> Carthaginian play one card -> 1
       2/2: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 1
     -10/10: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -4/4: Retreat [3,2] to [1,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -3/3: Retreat [3,2] to [2,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -3/3: Retreat [3,2] to [3,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
     0/3: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
      0/3: Retreat [2,2] to [2,1] -> Roman battle -> 1
       0/2: End phase -> Carthaginian play one card -> 1
      0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
     3/3: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
      0/0: Retreat [2,2] to [2,1] -> Roman battle -> 0
      -3/3: Retreat [2,2] to [3,1] -> Roman battle -> 1
       2/2: End phase -> Carthaginian play one card -> 1\n`);
});
