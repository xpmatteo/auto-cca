import * as fs from "fs";
import { DecisionNode, MctsPlayer } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard } from "model/cards.js";
import { CloseCombatCommand } from "model/commands/close_combat_command.js";
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
import { fixedRandom } from "xlib/random.js";

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
   Math.random = fixedRandom;
});

afterEach(() => {
    Math.random = originalRandom;
});

test('2 on 2', () => {
    const player = new MctsPlayer();
    const game = makeGame(new TwoOnTwoMeleeScenario());

    const root = player.search(game, 2000);

    const rootAsString = root.toString(3);
    expect(rootAsString).toBe(`1393/2000: undefined -> Roman play one card -> 1
 1393/2000: PlayCard(Order Heavy Troops) -> Roman order 3 heavy units -> 1
  1393/1999: End phase -> Roman movement -> 11
   1/21: Move [-1,6] to [-1,7] -> Roman movement -> 6
   1/21: Move [0,6] to [1,5] -> Roman movement -> 7
   148/232: Move [0,6] to [-1,7] -> Roman movement -> 6
   65/122: Move [-1,6] to [0,5] -> Roman movement -> 6
   1141/1434: Move [-1,6] to [-1,5] -> Roman movement -> 7
   -1/18: Move [-1,6] to [-2,7] -> Roman movement -> 7
   -1/17: Move [0,6] to [0,7] -> Roman movement -> 7
   0/19: Move [-1,6] to [-2,6] -> Roman movement -> 7
   0/19: End phase -> Roman battle -> 1
   34/64: Move [0,6] to [1,6] -> Roman movement -> 7
   5/31: Move [0,6] to [0,5] -> Roman movement -> 6\n`);
});

test('akragas', () => {
    const player = new MctsPlayer();
    const game = makeGame(new AkragasScenario());

    const root = player.search(game, 2000);
    //dumpTreeToFile(root, 'tree.txt');

    const rootAsString = root.toString(2);
    expect(rootAsString).toBe(`0/2000: undefined -> Syracusan play one card -> 3
 0/667: PlayCard(Order Light Troops) -> Syracusan order 6 light units -> 7
  0/96: OrderUnit([-2,7],[-1,7],[5,7],[6,7],[3,6],[7,6]) -> Syracusan order 6 light units -> 1
  0/95: OrderUnit([-2,7],[-1,7],[5,7],[6,7],[0,6],[7,6]) -> Syracusan order 6 light units -> 1
  0/95: OrderUnit([-1,7],[5,7],[6,7],[0,6],[3,6],[7,6]) -> Syracusan order 6 light units -> 1
  0/95: OrderUnit([-2,7],[-1,7],[6,7],[0,6],[3,6],[7,6]) -> Syracusan order 6 light units -> 1
  0/96: OrderUnit([-2,7],[5,7],[6,7],[0,6],[3,6],[7,6]) -> Syracusan order 6 light units -> 1
  0/95: OrderUnit([-2,7],[-1,7],[5,7],[0,6],[3,6],[7,6]) -> Syracusan order 6 light units -> 1
  0/95: OrderUnit([-2,7],[-1,7],[5,7],[6,7],[0,6],[3,6]) -> Syracusan order 6 light units -> 1
 0/667: PlayCard(Order Heavy Troops) -> Syracusan order 6 heavy units -> 1
  0/666: End phase -> Syracusan movement -> 16
 0/666: PlayCard(Order Medium Troops) -> Syracusan order 6 medium units -> 1
  0/666: End phase -> Syracusan movement -> 15\n`);
});


describe('Non deterministic results', () => {

    xtest('select the best uct child and then battles', () => {
        const player = new MctsPlayer();
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
        game.placeUnit(hexOf(1, 0), new CarthaginianMediumInfantry());
        game.handSouth = [new OrderHeavyTroopsCard()];
        const root = new DecisionNode(game);

        player.iterate(root); // play card
        player.iterate(root); // end phase
        player.iterate(root); // move
        player.iterate(root); // end phase
        for (let i = 0; i < 100; i++) {
            player.iterate(root); // close combat
        }

        // console.log(root.toString(4))
        // //     43/7: undefined -> Roman play one card -> 1
        // //      43/7: PlayCard(Order Heavy Troops) -> Roman order 1 heavy units -> 1
        // //       43/6: End phase -> Roman movement -> 2
        // //        0/2: Move [0,0] to [0,1] -> Roman movement -> 1
        // //         0/1: End phase -> Roman battle -> 0
        // //        43/3: End phase -> Roman battle -> 2
        // //         43/1: Close Combat from [0,0] to [1,0] -> Roman battle -> 0
        // //         0/1: End phase -> Carthaginian play one card -> 0
        // expect(root.describeNode()).toBe("30/7: undefined -> Roman play one card -> 1");
        // expect(root.children[0].describeNode()).toBe("30/7: PlayCard\(Order Heavy Troops\) -> Roman order 1 heavy units -> 1");
        // expect(root.children[0].children[0].describeNode()).toBe("30/6: End phase -> Roman movement -> 2");
        // expect(root.children[0].children[0].children[0].describeNode()).toBe("0/2: Move [0,0] to [0,1] -> Roman movement -> 1");
        // expect(root.children[0].children[0].children[0].children[0].describeNode()).toBe("0/1: End phase -> Roman battle -> 0");
        // expect(root.children[0].children[0].children[1].describeNode()).toBe("30/3: End phase -> Roman battle -> 2");
        // expect(root.children[0].children[0].children[1].children[0].describeNode()).toMatch(/30\/1: Close Combat from \[0,0\] to \[1,0\] -> Roman (battle|retreat) -> 0/);
        // expect(root.children[0].children[0].children[1].children[1].describeNode()).toBe("0/1: End phase -> Carthaginian play one card -> 0");
    });


    xtest('close combat from light to heavy', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(2, 3), new RomanLightInfantry());

        const nondeterministicResults = executeCommandManyTimes(game, new CloseCombatCommand(hexOf(2, 2), hexOf(2, 3)), 10000);
        nondeterministicResults.delete(0);

        expectBetween(nondeterministicResults.averageScore(), -23, -21);
        expect(nondeterministicResults.closestScoreToAverageScore()).toBe(-20);
    });

    function expectBetween(actual, lowerBound, upperBound) {
        if (actual < lowerBound || actual > upperBound) {
            throw new Error(`${actual} is not between ${lowerBound} and ${upperBound}`);
        }
    }

    xtest('close combat from heavy to heavy', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(2, 3), new RomanHeavyInfantry());

        const nondeterministicResults = executeCommandManyTimes(game, new CloseCombatCommand(hexOf(2, 2), hexOf(2, 3)), 10000);
        nondeterministicResults.delete(0);

        //console.log(nondeterministicResults.toString());
        expectBetween(nondeterministicResults.averageScore(), 18, 21);
        expect(nondeterministicResults.closestScoreToAverageScore()).toBe(20);
    });

    xtest('ranged combat', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(2, 4), new RomanLightInfantry());

        const nondeterministicResults = executeCommandManyTimes(game, new RangedCombatCommand(hexOf(2, 2), hexOf(2, 4)), 10000);
        nondeterministicResults.delete(0);

        //console.log(nondeterministicResults.toString());
        expectBetween(nondeterministicResults.averageScore(), 9, 11);
        expect(nondeterministicResults.closestScoreToAverageScore()).toBe(10);
    });
});
