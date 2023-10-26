import { sample } from "ai/macro_command_sampling.js";
import { MacroCommand } from "model/commands/macro_command.js";
import { MoveCommand } from "model/commands/move_command.js";
import { hexOf } from "xlib/hexlib.js";


/**
 * @param {Hex} hex
 */
function scoreFunction(hex) {
    return hex.q + 10 * hex.r;
}

describe('construct the best move for each unit individually', () => {
    test('just one command', () => {
        const availableMoves = [
            new MoveCommand(hexOf(1, 4), hexOf(1, 5)),
        ]

        const macroMove = sample(availableMoves, scoreFunction);

        expect(macroMove).toEqual(new MacroCommand([
            new MoveCommand(hexOf(1, 4), hexOf(1, 5)),
        ]));
    });

    test('one unit, two commands', () => {
        const availableMoves = [
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(2, 2), hexOf(0, 0)),
        ]

        const macroMove = sample(availableMoves, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            new MoveCommand(hexOf(2, 2), hexOf(0, 0)),
        ]).toString());
    });

    test('two units, one command each', () => {
        const availableCommands = [
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]).toString());
    });

    test('avoid toHex collisions', () => {
        const availableCommands = [
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(3, 3), hexOf(0, 0)),
            new MoveCommand(hexOf(1, 1), hexOf(2, 2)),
            new MoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            new MoveCommand(hexOf(3, 3), hexOf(0, 0)),
            new MoveCommand(hexOf(1, 1), hexOf(2, 2)),
        ]).toString());
    });

    test('there may be no way to place a unit', () => {
        const availableCommands = [
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(1, 1), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
        ]).toString());
    });

    test('Position the most constrained unit first', () => {
        const availableCommands = [
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(3, 3), hexOf(0, 0)),
            new MoveCommand(hexOf(3, 3), hexOf(2, 2)),
        ]

        const macroMove = sample(availableCommands, scoreFunction);

        expect(macroMove.toString()).toEqual(new MacroCommand([
            new MoveCommand(hexOf(3, 3), hexOf(2, 2)),
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
        ]).toString());
    });
});
