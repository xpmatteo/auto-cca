import { MctsPlayer, TreeNode } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard } from "model/cards.js";
import { Dice, diceReturning, RESULT_FLAG, RESULT_HEAVY, RESULT_LIGHT, RESULT_MEDIUM } from "model/dice.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry, CarthaginianMediumInfantry, RomanHeavyInfantry } from "model/units.js";
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
                return results[results.length - 1];
            }
            return results[nextResultIndex++];
        }
    }
}

test('select the best uct child and then battles', () => {
    const player = new MctsPlayer({nonDeterministicCommandRepetitions: 10000});
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new CarthaginianMediumInfantry());
    game.handSouth = [new OrderHeavyTroopsCard()];
    const root = new TreeNode(game);

    player.iterate(root); // play card
    player.iterate(root); // end phase
    player.iterate(root); // move
    player.iterate(root); // end phase
    player.iterate(root); // close combat

    // console.log(root.toString(4))
    //     43/7: undefined -> Roman play one card -> 1
    //      43/7: PlayCard(Order Heavy Troops) -> Roman order 1 heavy units -> 1
    //       43/6: End phase -> Roman movement -> 2
    //        0/2: Move [0,0] to [0,1] -> Roman movement -> 1
    //         0/1: End phase -> Roman battle -> 0
    //        43/3: End phase -> Roman battle -> 2
    //         43/1: Close Combat from [0,0] to [1,0] -> Roman battle -> 0
    //         0/1: End phase -> Carthaginian play one card -> 0
    expect(root.describeNode()).toBe("30/7: undefined -> Roman play one card -> 1");
    expect(root.children[0].describeNode()).toBe("30/7: PlayCard\(Order Heavy Troops\) -> Roman order 1 heavy units -> 1");
    expect(root.children[0].children[0].describeNode()).toBe("30/6: End phase -> Roman movement -> 2");
    expect(root.children[0].children[0].children[0].describeNode()).toBe("0/2: Move [0,0] to [0,1] -> Roman movement -> 1");
    expect(root.children[0].children[0].children[0].children[0].describeNode()).toBe("0/1: End phase -> Roman battle -> 0");
    expect(root.children[0].children[0].children[1].describeNode()).toBe("30/3: End phase -> Roman battle -> 2");
    expect(root.children[0].children[0].children[1].children[0].describeNode()).toMatch(/30\/1: Close Combat from \[0,0\] to \[1,0\] -> Roman (battle|retreat) -> 0/);
    expect(root.children[0].children[0].children[1].children[1].describeNode()).toBe("0/1: End phase -> Carthaginian play one card -> 0");
});
