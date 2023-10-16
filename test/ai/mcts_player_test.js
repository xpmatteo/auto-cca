import { MctsPlayer, DecisionNode, ChanceNode } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard } from "model/cards.js";
import { CloseCombatCommand } from "model/commands/close_combat_command.js";
import { RangedCombatCommand } from "model/commands/ranged_combat_command.js";
import { Dice, diceReturning, RESULT_FLAG, RESULT_HEAVY, RESULT_LIGHT, RESULT_MEDIUM } from "model/dice.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import {
    CarthaginianHeavyInfantry,
    CarthaginianMediumInfantry,
    RomanHeavyInfantry,
    RomanLightInfantry
} from "model/units.js";
import { hexOf } from "xlib/hexlib.js";


it('expands one node', () => {
    const player = new MctsPlayer();
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.handSouth = [new OrderHeavyTroopsCard()];
    game.executeCommand(game.validCommands()[0]); // play order heavy troops card
    game.executeCommand(game.validCommands()[0]); // end phase
    const root = new DecisionNode(game);

    player.iterate(root);

    expect(root.describeNode()).toBe("0/1: undefined -> Roman movement -> 3");
    expect(root.children[0].describeNode()).toMatch(/0\/[01]: Move \[0,0\] to \[1,0\] -> Roman movement -> 0/);
    expect(root.children[1].describeNode()).toMatch(/0\/[01]: Move \[0,0\] to \[0,1\] -> Roman movement -> 0/);
    expect(root.children[2].describeNode()).toMatch(/0\/[01]: End phase -> Roman battle -> 0/);
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

describe('Non deterministic results', () => {
    test('better', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
        game.placeUnit(hexOf(1, 0), new CarthaginianMediumInfantry());
        game.handSouth = [new OrderHeavyTroopsCard()];
        game.executeCommand(game.validCommands()[0]); // play order heavy troops card
        game.executeCommand(game.validCommands()[0]); // end phase
        game.executeCommand(game.validCommands()[0]); // move
        game.executeCommand(game.validCommands()[0]); // end phase
        const chanceNode = new ChanceNode(game, null, new CloseCombatCommand(hexOf(0, 1), hexOf(1, 0)));
        console.log(game.validCommands().toString());
        for (let i = 0; i < 100; i++) {
            chanceNode.bestUctChild();
        }
        console.log(chanceNode.children.length);
        console.log(chanceNode.children.map(child => child.describeNode()));
        console.log(chanceNode.toString(4))
    });

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

        console.log(root.toString(4))
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
