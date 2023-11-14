import { fixedRandom, resetFixedRandom } from "../lib/random.js";
import { Command } from "../model/commands/commands.js";
import { Side } from "../model/side.js";
import OpenLoopNode from './OpenLoopNode.js';


describe('Open Loop nodes', () => {
    function aCommand(name) {
        const command = new Command();
        command.toString = () => `${name} command}`;
        return command;
    }

    const originalRandom = global.Math.random;
    beforeAll(() => {
        Math.random = fixedRandom;
        resetFixedRandom();
    });

    afterAll(() => {
        Math.random = originalRandom;
    });

    const commandA = aCommand("A");
    const commandB = aCommand("B");
    const commandC = aCommand("C");

    describe('Best UCT child', () => {

        const gamePrototype = {
            currentSide: Side.ROMAN,
            commandHistory: [],
            validCommands() {
                return [commandA, commandB]
            },
            executeCommand(command) {
                this.currentSide = Side.CARTHAGINIAN;
                this.commandHistory.push(command);
            },
            clone() {
                return Object.fromEntries(Object.entries(this));
            }
        };

        test('new node: any command may be returned', () => {
            const node = new OpenLoopNode(Side.ROMAN, null, 1, 1);
            const game = Object.assign({}, gamePrototype);

            const [newGame, bestUctChild] = node.bestUctChild(game);

            expect(node.childrenSize).toBe(1);
            expect(bestUctChild).toEqual(new OpenLoopNode(Side.CARTHAGINIAN, node));
            expect(node.getChildNode(commandA)).toStrictEqual(bestUctChild);
            expect(newGame.currentSide).toBe(Side.CARTHAGINIAN);
        });

        test('the best of the existing commands is returned', () => {
            const childA = new OpenLoopNode(Side.CARTHAGINIAN, null, -99, 100);
            const childB = new OpenLoopNode(Side.CARTHAGINIAN, null, -100, 100);
            const node = new OpenLoopNode(Side.ROMAN, null, 1, 1);
            node.addChild(commandA, childA);
            node.addChild(commandB, childB);
            const game = Object.assign({}, gamePrototype);

            const [newGame, bestUctChild] = node.bestUctChild(game);

            expect(node.childrenSize).toBe(2);
            expect(bestUctChild).toBe(childB);
            expect(game.currentSide).toBe(Side.ROMAN);
            expect(newGame.currentSide).toBe(Side.CARTHAGINIAN);
        });

        test('there is one valid command that was never executed', () => {
            const childA = new OpenLoopNode(Side.CARTHAGINIAN, null, -99, 100);
            const node = new OpenLoopNode(Side.ROMAN, null, 1, 1);
            node.addChild(commandA, childA);
            const game = Object.assign({}, gamePrototype);

            const [newGame, bestUctChild] = node.bestUctChild(game);

            expect(node.childrenSize).toBe(2);
            expect(bestUctChild).toEqual(new OpenLoopNode(Side.CARTHAGINIAN, node));
            expect(bestUctChild).toBe(node.getChildNode(commandB));
            expect(game.currentSide).toBe(Side.ROMAN);
            expect(newGame.currentSide).toBe(Side.CARTHAGINIAN);
            expect(bestUctChild.parent).toBe(node);
        });
    });

    describe('backpropagate', () => {
        test('the score is updated', () => {
            const parent = new OpenLoopNode(Side.CARTHAGINIAN, null, 10, 1);
            const node = new OpenLoopNode(Side.ROMAN, parent, 10, 1);
            node.backPropagate(1, Side.CARTHAGINIAN);

            expect(node.score).toBe(9);
            expect(node.visits).toBe(2);
            expect(parent.score).toBe(11);
            expect(parent.visits).toBe(2);
        });
    });

    describe('bestCommands', () => {
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

        it('should return the best commands sequence from root to leaf', () => {
            const rootNode = new OpenLoopNode(Side.ROMAN, null, 1, 1);
            const child1 = new OpenLoopNode(Side.ROMAN, rootNode, 3, 1);
            const child2 = new OpenLoopNode(Side.ROMAN, rootNode, 4, 1);
            const grandChild = new OpenLoopNode(Side.ROMAN, child2, 5, 1);
            const child1command = aDeterministicCommand('child1Command');
            const child2command = aDeterministicCommand('child2Command');
            const grandChildCommand = aDeterministicCommand('grandChildCommand');
            rootNode.addChild(child1command, child1);
            rootNode.addChild(child2command, child2);
            child2.addChild(grandChildCommand, grandChild);

            const result = rootNode.bestCommands();

            expect(names(result)).toEqual(['child2Command', 'grandChildCommand']);
        });

        it('should stop at the command that will switch side', () => {
            const rootNode = new OpenLoopNode(Side.ROMAN);

            const child1 = new OpenLoopNode(Side.CARTHAGINIAN, rootNode, 3, 1);
            const child1command = aDeterministicCommand('child1Command');

            const grandChild = new OpenLoopNode(Side.ROMAN, child1, 5, 1);
            const grandChildCommand = aDeterministicCommand('grandChildCommand');

            rootNode.addChild(child1command, child1);
            child1.addChild(grandChildCommand, grandChild);

            const result = rootNode.bestCommands(Side.ROMAN);
            expect(names(result)).toEqual(['child1Command']);
        });

        it('should stop after the first command that is not deterministic', () => {
            const rootNode = new OpenLoopNode(Side.ROMAN);

            const child1 = new OpenLoopNode(Side.ROMAN, rootNode, 3, 1);
            const child1command = aNonDeterministicCommand('child1Command');

            const grandChild = new OpenLoopNode(Side.ROMAN, child1, 5, 1);
            const grandChildCommand = aDeterministicCommand('grandChildCommand');

            rootNode.addChild(child1command, child1);
            child1.addChild(grandChildCommand, grandChild);

            const result = rootNode.bestCommands(Side.ROMAN);
            expect(names(result)).toEqual(['child1Command']);
        });
    });

});
