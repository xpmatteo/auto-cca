
import { fixedRandom, resetFixedRandom } from "../lib/random.js";
import { Command } from "../model/commands/commands.js";
import { Side } from "../model/side.js";
import OpenLoopNode from './OpenLoopNode.js';


describe('Open Loop nodes', () => {
    function aCommand(name) {
        return new Command();
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

    describe('Best UCT child', () => {
        test('new node: any command may be returned', () => {
            const node = new OpenLoopNode(Side.ROMAN);
            const game = {
                currentSide: Side.ROMAN,
                validCommands() {
                    return [commandA, commandB]
                },
                executeCommand(command) {
                    this.currentSide = Side.CARTHAGINIAN;
                }
            };

            const bestUctChild = node.bestUctChild(game);

            expect(node.children.size).toBe(1);
            expect(bestUctChild).toEqual(new OpenLoopNode(Side.CARTHAGINIAN));
            expect(node.children.get(commandA)).toBe(bestUctChild);
            expect(game.currentSide).toBe(Side.CARTHAGINIAN);
        });




    });
});
