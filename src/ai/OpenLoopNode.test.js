
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
            const node = new OpenLoopNode(Side.ROMAN, 1, 1);
            const game = Object.assign({}, gamePrototype);

            const [newGame, bestUctChild] = node.bestUctChild(game);

            expect(node.children.size).toBe(1);
            expect(bestUctChild).toEqual(new OpenLoopNode(Side.CARTHAGINIAN));
            expect(node.children.get(commandA.toString())).toStrictEqual(bestUctChild);
            expect(newGame.currentSide).toBe(Side.CARTHAGINIAN);
        });

        test('the best of the existing commands is returned', () => {
            const childA = new OpenLoopNode(Side.CARTHAGINIAN, -99, 100);
            const childB = new OpenLoopNode(Side.CARTHAGINIAN, -100, 100);
            const node = new OpenLoopNode(Side.ROMAN, 1, 1, new Map([
                [commandA.toString(), childA],
                [commandB.toString(), childB],
            ]));
            const game = Object.assign({}, gamePrototype);

            const [newGame, bestUctChild] = node.bestUctChild(game);

            expect(node.children.size).toBe(2);
            expect(bestUctChild).toBe(childB);
            expect(game.currentSide).toBe(Side.ROMAN);
            expect(newGame.currentSide).toBe(Side.CARTHAGINIAN);
        });

        test('there is one valid command that was never executed', () => {
            const childA = new OpenLoopNode(Side.CARTHAGINIAN, -99, 100);
            const node = new OpenLoopNode(Side.ROMAN, 1, 1, new Map([
                [commandA.toString(), childA],
            ]));
            const game = Object.assign({}, gamePrototype);

            const [newGame, bestUctChild] = node.bestUctChild(game);

            expect(node.children.size).toBe(2);
            expect(bestUctChild).toEqual(new OpenLoopNode(Side.CARTHAGINIAN, 0, 0));
            expect(bestUctChild).toBe(node.children.get(commandB.toString()));
            expect(game.currentSide).toBe(Side.ROMAN);
            expect(newGame.currentSide).toBe(Side.CARTHAGINIAN);
        });

    });
});
