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
    expect(rootAsString).toBe(`379/2000: undefined -> Roman play one card -> 1
 379/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  379/1999: End phase -> Roman movement -> 1
   379/1998: MacroCommand(Move [-1,6] to [0,5],Move [0,6] to [1,5]) -> Roman battle -> 3
    CHANCE/80: Close Combat from [0,5] to [1,4] -> Roman battle -> 3
     5/18: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      -5/18: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -41/49: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      41/49: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -6/12: Close Combat from [0,5] to [1,4] -> Carthaginian retreat -> 2
      6/12: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
    CHANCE/1486: Close Combat from [0,5] to [0,4] -> Roman battle -> 1
     79/1485: Close Combat from [0,5] to [0,4] -> Roman retreat -> 2
      -30/494: Retreat [0,5] to [0,6] -> Roman battle -> 1
      109/991: Retreat [0,5] to [-1,6] -> Roman battle -> 1
    CHANCE/433: Close Combat from [1,5] to [1,4] -> Roman battle -> 6
     -16/40: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      -8/21: Retreat [1,5] to [0,6] -> Roman battle -> 2
      -8/19: Retreat [1,5] to [1,6] -> Roman battle -> 2
     56/70: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      28/35: Retreat [1,5] to [0,6] -> Roman battle -> 2
      28/35: Retreat [1,5] to [1,6] -> Roman battle -> 2
     -59/59: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      59/59: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     -120/133: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      120/133: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     17/68: Close Combat from [1,5] to [1,4] -> Carthaginian retreat -> 2
      -17/68: Retreat [1,4] to [1,3] -> Roman battle -> 1
      0/0: Retreat [1,4] to [2,3] -> Roman battle -> 0
     54/62: Close Combat from [1,5] to [1,4] -> Roman retreat -> 2
      27/31: Retreat [1,5] to [0,6] -> Roman battle -> 2
      27/31: Retreat [1,5] to [1,6] -> Roman battle -> 2\n`);
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
     -10/10: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -4/4: Retreat [3,2] to [1,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -3/3: Retreat [3,2] to [2,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      -3/3: Retreat [3,2] to [3,4] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
     -6/6: Close Combat from [3,2] to [2,2] -> Roman battle -> 1
      6/6: End phase -> Carthaginian play one card -> 1
       5/5: PlayCard(Order Heavy Troops) -> Carthaginian order 1 heavy units -> 1
     0/3: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
      0/3: Retreat [2,2] to [2,1] -> Roman battle -> 1
       0/2: End phase -> Carthaginian play one card -> 1
      0/0: Retreat [2,2] to [3,1] -> Roman battle -> 0
     -3/3: Close Combat from [3,2] to [2,2] -> Roman retreat -> 3
      -1/1: Retreat [3,2] to [1,4] -> Roman battle -> 1
       1/1: End phase -> Carthaginian play one card -> 0
      -2/2: Retreat [3,2] to [3,4] -> Roman battle -> 1
       1/1: End phase -> Carthaginian play one card -> 0
      0/0: Retreat [3,2] to [2,4] -> Roman battle -> 0
     4/4: Close Combat from [3,2] to [2,2] -> Carthaginian retreat -> 2
      -4/4: Retreat [2,2] to [3,1] -> Roman battle -> 1
       3/3: End phase -> Carthaginian play one card -> 1
      0/0: Retreat [2,2] to [2,1] -> Roman battle -> 0\n`);
});
