import { ChanceNode, DecisionNode } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard } from "model/cards.js";
import { CloseCombatCommand } from "model/commands/close_combat_command.js";
import { EndPhaseCommand } from "model/commands/end_phase_command.js";
import { PlayCardCommand } from "model/commands/play_card_command.js";
import { diceReturning, RESULT_HEAVY } from "model/dice.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { Side } from "model/side.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";

function gameWithSide(side) {
    return {
        currentSide: side,
    };
}

function aDeterministicCommand(name) {
    return {
        isDeterministic: () => true,
        toString: () => name,
    };
}

function aNonDeterministicCommand(name) {
    return {
        isDeterministic: () => false,
        toString: () => name,
    };
}

function names(commands) {
    return commands.map(c => c.toString());
}

describe('Decision node', () => {

    describe('bestCommands', () => {
        let game = gameWithSide('A');

        it('should return the best commands sequence from root to leaf', () => {
            const rootNode = new DecisionNode(game);
            rootNode.command = undefined;

            const child1 = new DecisionNode(game, rootNode, 3, 1);
            child1.command = aDeterministicCommand('child1Command');

            const child2 = new DecisionNode(game, rootNode, 4, 1);
            child2.command = aDeterministicCommand('child2Command');

            const grandChild = new DecisionNode(game, child2, 5, 1);
            grandChild.command = aDeterministicCommand('grandChildCommand');

            rootNode.children = [child1, child2];
            child2.children = [grandChild];

            const result = rootNode.bestCommands();
            expect(names(result)).toEqual(['child2Command', 'grandChildCommand']);
        });

        it('should stop at the command that will switch side', () => {
            const rootNode = new DecisionNode(game);
            rootNode.command = undefined;
            rootNode.game = gameWithSide('A');

            const child1 = new DecisionNode(game, rootNode, 3, 1);
            child1.command = aDeterministicCommand('child1Command');
            child1.game = gameWithSide('B');

            const grandChild = new DecisionNode(game, child1, 5, 1);
            grandChild.command = aDeterministicCommand('grandChildCommand');
            grandChild.game = gameWithSide('A');

            rootNode.children = [child1];
            child1.children = [grandChild];

            const result = rootNode.bestCommands('A');
            expect(names(result)).toEqual(['child1Command']);
        });

        it('should stop after the first command that is not deterministic', () => {
            const rootNode = new DecisionNode(game);
            rootNode.command = aDeterministicCommand('rootCommand');
            rootNode.game = gameWithSide('A');

            const child1 = new DecisionNode(game, rootNode, 3, 1);
            child1.command = aNonDeterministicCommand('child1Command');
            child1.game = gameWithSide('A');

            const grandChild = new DecisionNode(game, child1, 5, 1);
            grandChild.command = aDeterministicCommand('grandChildCommand');
            grandChild.game = gameWithSide('A');

            rootNode.children = [child1];
            child1.children = [grandChild];

            const result = rootNode.bestCommands('A');
            expect(names(result)).toEqual(['rootCommand', 'child1Command']);
        });
    });

    describe('expansion', () => {

        it('should expand the node with the valid commands', () => {
            const game = makeGame(new NullScenario());
            game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
            game.handSouth = [new OrderHeavyTroopsCard()];
            const node = new DecisionNode(game);

            node.expand();

            expect(node.children.length).toBe(1);
            const child = node.children[0];
            expect(child.command).toEqual(new PlayCardCommand(new OrderHeavyTroopsCard()));
            expect(child.visits).toBe(0);
            expect(child.score).toBe(0);
        });

        it('expands nondeterministic commands to chance nodes', () => {
            const game = makeGame(new NullScenario());
            game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
            game.placeUnit(hexOf(1, 0), new CarthaginianHeavyInfantry());
            game.handSouth = [new OrderHeavyTroopsCard()];
            game.executeCommand(game.validCommands()[0]); // play card
            game.executeCommand(game.validCommands()[0]); // end phase
            game.executeCommand(game.validCommands()[0]); // move from 0,0 to 0,1
            game.executeCommand(game.validCommands()[0]); // end phase
            const node = new DecisionNode(game);

            node.expand();

            expect(node.children.length).toBe(2);
            const child0 = node.children[0];
            expect(child0.command.toString()).toBe("Close Combat from [0,1] to [1,0]");
            expect(child0.value()).toBe(Infinity);
            expect(child0 instanceof ChanceNode).toBe(true);
            expect(child0.game).toBe(game);

            const child1 = node.children[1];
            expect(child1.command).toEqual(new EndPhaseCommand());
            expect(child1.value()).toBe(Infinity);
            expect(child1 instanceof DecisionNode).toBe(true);
            expect(child1.game).not.toBe(game);
        });
    });

    describe('best uct child', () => {
        test('when all children are the same side as the current node', () => {
            const rootNode = new DecisionNode(gameWithSide('A'), null, 0, 1);
            const child1 = new DecisionNode(gameWithSide('A'), rootNode, 100, 1);
            const child2 = new DecisionNode(gameWithSide('A'), rootNode, 90, 1);
            rootNode.children = [child1, child2];

            const result = rootNode.bestUctChild();

            expect(result).toBe(child1);
        });

        describe('when some children are the opposite side as the current node', () => {
            test('the best command keeps control to current side', () => {
                const rootNode = new DecisionNode(gameWithSide('A'), null, 0, 1);
                const child1 = new DecisionNode(gameWithSide('B'), rootNode, 100, 1);
                const child2 = new DecisionNode(gameWithSide('A'), rootNode, 90, 1);
                rootNode.children = [child1, child2];

                const result = rootNode.bestUctChild();

                expect(result).toBe(child2);
            });

            test('the best command ends the turn', () => {
                const rootNode = new DecisionNode(gameWithSide('A'), null, 0, 1);
                const child1 = new DecisionNode(gameWithSide('B'), rootNode, -100, 1);
                const child2 = new DecisionNode(gameWithSide('A'), rootNode, 90, 1);
                rootNode.children = [child1, child2];

                const result = rootNode.bestUctChild();

                expect(result).toBe(child1);
            });
        });
    });

    test('back propagation', () => {
        const rootNode = new DecisionNode(gameWithSide('A'), null, 200, 1);
        const child1 = new DecisionNode(gameWithSide('B'), rootNode, 100, 1);
        const child2 = new DecisionNode(gameWithSide('A'), child1, 0, 1);

        child2.backPropagate(10, 'A');

        expect(child2.score).toBe(10);
        expect(child1.score).toBe(90);
        expect(rootNode.score).toBe(210);
    });
});

describe('Chance node', () => {
    test('value of node with no children', () => {
        expect(new ChanceNode().value()).toBe(Infinity);
    });

    test('value of node with children', () => {
        const game = {};
        const chanceNode = new ChanceNode();
        const child1 = new DecisionNode(game, chanceNode, 10, 10);
        const child2 = new DecisionNode(game, chanceNode, 0, 10);
        chanceNode.children = [child1, child2];

        expect(chanceNode.value()).toBeCloseTo(0.5);
    });

    test('backpropagation from chance to decision', () => {
        const game = makeGame(new NullScenario());
        const grandParent = new DecisionNode(game, null, 0, 1);
        const parent = new DecisionNode(game, grandParent, 2, 2);
        const child = new ChanceNode({}, parent);

        child.backPropagate(0.5, Side.CARTHAGINIAN);

        expect(parent.score).toBe(1.5);
        expect(parent.visits).toBe(3);
        expect(grandParent.score).toBe(-0.5);
        expect(grandParent.visits).toBe(2);
    });

    test('backpropagation from decision to chance', () => {
        const game = makeGame(new NullScenario());
        const grandParent = new DecisionNode(game, null, 0, 1);
        const parent = new ChanceNode(game, grandParent);
        const child = new DecisionNode(game, parent, 3, 3);

        child.backPropagate(0.5, Side.ROMAN);

        expect(child.score).toBe(3.5);
        expect(child.visits).toBe(4);
        expect(grandParent.score).toBe(0.5);
        expect(grandParent.visits).toBe(2);
    });
    
    function evolveGameToCloseCombat(game) {
        game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
        game.placeUnit(hexOf(1, 0), new CarthaginianHeavyInfantry());
        game.handSouth = [new OrderHeavyTroopsCard()];
        game.executeCommand(game.validCommands()[0]); // play card
        game.executeCommand(game.validCommands()[0]); // end phase
        game.executeCommand(game.validCommands()[0]); // move from 0,0 to 0,1
        game.executeCommand(game.validCommands()[0]); // end phase
    }

    describe('executes a random move when visited', () => {

        it('when no children', () => {
            const game = makeGame(new NullScenario());
            evolveGameToCloseCombat(game);
            const command = game.validCommands()[0];
            const node = new ChanceNode(game, null, command);

            const result = node.bestUctChild();

            expect(node.children.length).toBe(1);
            expect(result).toBe(node.children[0]);
            expect(result.command.toString()).toBe("Close Combat from [0,1] to [1,0]");
            expect(result.value()).toBe(Infinity);
            expect(result instanceof DecisionNode).toBe(true);
            expect(result.game).not.toBe(game);
        });

        it('when the result is same as previous ', () => {
            const game = makeGame(new NullScenario(), diceReturning([RESULT_HEAVY, RESULT_HEAVY, RESULT_HEAVY, RESULT_HEAVY, RESULT_HEAVY]));
            evolveGameToCloseCombat(game);
            const command = game.validCommands()[0];
            const node = new ChanceNode(game, null, command);

            node.bestUctChild();
            const result = node.bestUctChild();

            expect(node.children.length).toBe(1);
            expect(result).toBe(node.children[0]);
            expect(result.command.toString()).toBe("Close Combat from [0,1] to [1,0]");
            expect(result.value()).toBe(Infinity);
            expect(result instanceof DecisionNode).toBe(true);
            expect(result.game).not.toBe(game);
        });

        it('when the result is different from previous', () => {
            const game = makeGame(new NullScenario());
            evolveGameToCloseCombat(game);
            const command = game.validCommands()[0];
            const node = new ChanceNode(game, null, command);

            node.bestUctChild();
            const result = node.bestUctChild();

            expect(node.children.length).toBe(2);
            expect(result).toBe(node.children[1]);
            expect(result.command.toString()).toBe("Close Combat from [0,1] to [1,0]");
            expect(result.value()).toBe(Infinity);
            expect(result instanceof DecisionNode).toBe(true);
            expect(result.game).not.toBe(game);
        });

    });

});
