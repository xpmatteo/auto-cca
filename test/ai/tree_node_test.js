
//

// CloseCombat > Retreat should return just CloseCombat

// EndPhase > CloseCombat1 > CloseCombat2 should return EndPhase > CloseCombat1

import { TreeNode } from "ai/mcts_player.js";

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

describe('TreeNode', () => {
    let game = gameWithSide('A');

    describe('bestCommands', () => {
        it('should return the best commands sequence from root to leaf', () => {
            const rootNode = new TreeNode(game);
            rootNode.command = undefined;

            const child1 = new TreeNode(game, rootNode, 3, 1);
            child1.command = aDeterministicCommand('child1Command');

            const child2 = new TreeNode(game, rootNode, 4, 1);
            child2.command = aDeterministicCommand('child2Command');

            const grandChild = new TreeNode(game, child2, 5, 1);
            grandChild.command = aDeterministicCommand('grandChildCommand');

            rootNode.children = [child1, child2];
            child2.children = [grandChild];

            const result = rootNode.bestCommands();
            expect(names(result)).toEqual(['child2Command', 'grandChildCommand']);
        });

        it('should stop at the command that will switch side', () => {
            const rootNode = new TreeNode(game);
            rootNode.command = undefined;
            rootNode.game = gameWithSide('A');

            const child1 = new TreeNode(game, rootNode, 3, 1);
            child1.command = aDeterministicCommand('child1Command');
            child1.game = gameWithSide('B');

            const grandChild = new TreeNode(game, child1, 5, 1);
            grandChild.command = aDeterministicCommand('grandChildCommand');
            grandChild.game = gameWithSide('A');

            rootNode.children = [child1];
            child1.children = [grandChild];

            const result = rootNode.bestCommands('A');
            expect(names(result)).toEqual(['child1Command']);
        });

        it('should stop after the first command that is not deterministic', () => {
            const rootNode = new TreeNode(game);
            rootNode.command = aDeterministicCommand('rootCommand');
            rootNode.game = gameWithSide('A');

            const child1 = new TreeNode(game, rootNode, 3, 1);
            child1.command = aNonDeterministicCommand('child1Command');
            child1.game = gameWithSide('A');

            const grandChild = new TreeNode(game, child1, 5, 1);
            grandChild.command = aDeterministicCommand('grandChildCommand');
            grandChild.game = gameWithSide('A');

            rootNode.children = [child1];
            child1.children = [grandChild];

            const result = rootNode.bestCommands('A');
            expect(names(result)).toEqual(['rootCommand', 'child1Command']);
        });
    });

    describe('best uct child', () => {
         test('when all children are the same side as the current node', () => {
            const rootNode = new TreeNode(game);
            rootNode.game = gameWithSide('A');

            const child1 = new TreeNode(game, rootNode, 3, 1);
            child1.game = gameWithSide('A');
            child1.score = 100;
            child1.visits = 1;

            const child2 = new TreeNode(game, rootNode, 4, 1);
            child2.game = gameWithSide('A');
             child1.score = 90;
             child1.visits = 1;

            rootNode.children = [child1, child2];

            const result = rootNode.bestUctChild(1);
            expect(result).toEqual(child1);
         });
    });
});
