import { MacroCommand } from "../model/commands/macro_command.js";

/**
 * @param {MoveCommand[]} validCommands
 * @param {function(Hex, Unit): number} scoreFunction
 * @returns {MacroCommand}
 */
export function sample(validCommands, scoreFunction) {
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


function groupByFromHex(availableCommands) {
    const groups = new Map();
    for (const command of availableCommands) {
        if (!command.fromHex) {
            continue;
        }
        if (!groups.get(command.fromHex)) {
            groups.set(command.fromHex, []);
        }
        groups.get(command.fromHex).push(command);
    }
    return groups;
}

