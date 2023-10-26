import { MoveCommand } from "model/commands/move_command.js";
import { hexOf } from "xlib/hexlib.js";

class MacroCommand {
    constructor(commands) {
        this.commands = commands;
    }

    toString() {
        return `MacroCommand(${this.commands})`;
    }
}

/**
 * @returns {MacroCommand}
 */
function sample(validCommands, scoreFunction) {
    function bestCommandForUnit(validCommands, scoreFunction, ToHexesTaken) {
        let bestCommand = undefined;
        let bestScore = -Infinity;
        for (const command of validCommands) {
            if (ToHexesTaken.has(command.toHex)) {
                continue;
            }
            const score = scoreFunction(command.toHex);
            if (score > bestScore) {
                bestScore = score;
                bestCommand = command;
            }
        }
        return bestCommand;
    }

    /**
     * @param {Map<Hex, MoveCommand[]>} groups
     */
    function sortByMostConstrainedUnitFirst(groups) {
        return Array.from(groups.keys()).sort((a, b) => groups.get(a).length - groups.get(b).length);
    }

    const groups = groupByFromHex(validCommands);
    const fromHexes = sortByMostConstrainedUnitFirst(groups);
    const macroCommands = [];
    const toHexesTaken = new Set();
    for (const fromHex of fromHexes) {
        const commands = groups.get(fromHex);
        const currentBest = bestCommandForUnit(commands, scoreFunction, toHexesTaken);
        if (currentBest) {
            macroCommands.push(currentBest);
            toHexesTaken.add(currentBest.toHex);
        }
    }
    return new MacroCommand(macroCommands);
}

/**
 * @param {Hex} hex
 */
function scoreFunction(hex) {
    return hex.q + 10 * hex.r;
}

function groupByFromHex(availableCommands) {
    const groups = new Map();
    for (const command of availableCommands) {
        if (!groups.get(command.fromHex)) {
            groups.set(command.fromHex, []);
        }
        groups.get(command.fromHex).push(command);
    }
    return groups;
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

    test('group by fromHex', () => {
        const availableCommands = [
            new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
            new MoveCommand(hexOf(2, 2), hexOf(0, 0)),
            new MoveCommand(hexOf(3, 3), hexOf(10, 10)),
            new MoveCommand(hexOf(4, 4), hexOf(10, 10)),
        ]

        expect(groupByFromHex(availableCommands)).toEqual(new Map([
            [hexOf(0, 0), [new MoveCommand(hexOf(1, 1), hexOf(0, 0)), new MoveCommand(hexOf(2, 2), hexOf(0, 0))]],
            [hexOf(10, 10), [new MoveCommand(hexOf(3, 3), hexOf(10, 10)), new MoveCommand(hexOf(4, 4), hexOf(10, 10))]],
        ]));
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
