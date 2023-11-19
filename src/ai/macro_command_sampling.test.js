import { perturbSample, sample } from "./macro_command_sampling.js";
import { endPhaseCommand } from "../model/commands/EndPhaseCommand.js";
import { MacroCommand } from "../model/commands/macro_command.js";
import { makeMoveCommand } from "../model/commands/move_command.js";
import { hexOf } from "../lib/hexlib.js";
import { fixedRandom, resetFixedRandom } from "../lib/random.js";


describe('construct the best move for each unit individually', () => {
    /**
     * @param {Hex} hex
     */
    function scoreFunction(hex) {
        return hex.q + 10 * hex.r;
    }

    test('just one command', () => {
        const availableMoves = [
            makeMoveCommand(hexOf(1, 4), hexOf(1, 5)),
        ]

        const macroMove = sample(availableMoves, scoreFunction);

        expect(macroMove).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(1, 4), hexOf(1, 5)),
        ]));
    });

    test('one unit, two commands', () => {
        const availableMoves = [
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(2, 2), hexOf(0, 0)),
        ]

        const macroMove = sample(availableMoves, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(2, 2), hexOf(0, 0)),
        ]).toString());
    });

    test('two units, one command each', () => {
        const availableCommands = [
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]).toString());
    });

    test('avoid toHex collisions', () => {
        const availableCommands = [
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
            makeMoveCommand(hexOf(1, 1), hexOf(2, 2)),
            makeMoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
            makeMoveCommand(hexOf(1, 1), hexOf(2, 2)),
        ]).toString());
    });

    test('there may be no way to place a unit', () => {
        const availableCommands = [
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(1, 1), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
        ]).toString());
    });

    test('Position the most constrained unit first', () => {
        const availableCommands = [
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
            makeMoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(3, 3), hexOf(2, 2)),
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
        ]).toString());
    });

    test('does not break for endPhase', () => {
        const availableCommands = [
            makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
            makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
            endPhaseCommand()
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
        ]).toString());
    });
});

describe('deriving a sample from another sample', () => {
    const originalRandom = Math.random;
    beforeEach(() => {
        resetFixedRandom();
        Math.random = fixedRandom;
    });

    afterEach(() => {
        Math.random = originalRandom;
    });

    const availableCommands = [
        makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
        makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
        endPhaseCommand(),
    ]
    const existingSample = new MacroCommand([
        makeMoveCommand(hexOf(1, 1), hexOf(0, 0)),
        makeMoveCommand(hexOf(4, 4), hexOf(10, 10)),
    ]);
    const existingSampleAsString = existingSample.toString();

    const newSample = perturbSample(availableCommands, existingSample);

    test('changes one unit movement', () => {
        expect(newSample.toString()).toEqual(new MacroCommand([
            makeMoveCommand(hexOf(3, 3), hexOf(0, 0)),
            makeMoveCommand(hexOf(4, 4), hexOf(10, 10)),
        ]).toString());
    });

    test('does not change the existing sample', () => {
        expect(existingSample.toString()).toEqual(existingSampleAsString);
    });

    test('chooses unit at random', () => {
    });

    test('chooses move at random', () => {
    });


});
