import { MctsPlayer, TreeNode } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard } from "model/cards.js";
import { Dice, diceReturning, RESULT_FLAG, RESULT_HEAVY, RESULT_MEDIUM } from "model/dice.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";


it('expands one node', () => {
    const player = new MctsPlayer();
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.handSouth = [new OrderHeavyTroopsCard()];
    game.executeCommand(game.validCommands()[0]); // play order heavy troops card
    game.executeCommand(game.validCommands()[0]); // end phase
    const root = new TreeNode(game);

    player.iterate(root);

    expect(root.describeNode()).toBe("0/3: undefined -> Roman movement -> 3");
    expect(root.children[0].describeNode()).toBe("0/1: Move [0,0] to [1,0] -> Roman movement -> 0");
    expect(root.children[1].describeNode()).toBe("0/1: Move [0,0] to [0,1] -> Roman movement -> 0");
    expect(root.children[2].describeNode()).toBe("0/1: End phase -> Roman battle -> 0");
});

function diceReturningSequence(...results) {
    let nextResultIndex = 0;
    return {
        roll: function (count) {
            if (nextResultIndex === results.length) {
                throw new Error("Not enough stubbed results");
            }
            return results[nextResultIndex++];
        }
    }
}

it('selects the best uct child and then battles', () => {
    const player = new MctsPlayer();
    const diceResultsGoodForRoman = [RESULT_HEAVY, RESULT_HEAVY, RESULT_HEAVY, RESULT_MEDIUM, RESULT_MEDIUM];
    const diceResultsBadForCarthaginian = [RESULT_MEDIUM, RESULT_MEDIUM, RESULT_MEDIUM, RESULT_MEDIUM, RESULT_MEDIUM];
    const game = makeGame(new NullScenario(), diceReturningSequence(diceResultsGoodForRoman, diceResultsBadForCarthaginian));
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new CarthaginianHeavyInfantry());
    game.handSouth = [new OrderHeavyTroopsCard()];
    const root = new TreeNode(game);

    player.iterate(root); // play card
    player.iterate(root); // end phase
    player.iterate(root); // move
    player.iterate(root); // end phase
    player.iterate(root); // close combat

    // console.log(root.toString(4));
    //     30/7: undefined -> Roman play one card -> 1
    //      30/7: PlayCard(Order Heavy Troops) -> Roman order 1 heavy units -> 1
    //       30/6: End phase -> Roman movement -> 2
    //        0/2: Move [0,0] to [0,1] -> Roman movement -> 1
    //         0/1: End phase -> Roman battle -> 0
    //        30/3: End phase -> Roman battle -> 2
    //         30/1: Close Combat from [0,0] to [1,0] -> Roman battle -> 0
    //         0/1: End phase -> Carthaginian play one card -> 0
    expect(root.describeNode()).toBe("30/7: undefined -> Roman play one card -> 1");
    expect(root.children[0].describeNode()).toBe("30/7: PlayCard(Order Heavy Troops) -> Roman order 1 heavy units -> 1");
    expect(root.children[0].children[0].describeNode()).toBe("30/6: End phase -> Roman movement -> 2");
    expect(root.children[0].children[0].children[0].describeNode()).toBe("0/2: Move [0,0] to [0,1] -> Roman movement -> 1");
    expect(root.children[0].children[0].children[0].children[0].describeNode()).toBe("0/1: End phase -> Roman battle -> 0");
    expect(root.children[0].children[0].children[1].describeNode()).toBe("30/3: End phase -> Roman battle -> 2");
    expect(root.children[0].children[0].children[1].children[0].describeNode()).toBe("30/1: Close Combat from [0,0] to [1,0] -> Roman battle -> 0");
    expect(root.children[0].children[0].children[1].children[1].describeNode()).toBe("0/1: End phase -> Carthaginian play one card -> 0");
});
