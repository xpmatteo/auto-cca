import { Hex } from "../lib/hexlib.js";
import { MacroCommand } from "../../model/commands/macro_command.js";
import { MoveCommand } from "../../model/commands/move_command.js";
import { Unit } from "../../model/units.js";

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

/**
 * @param {MoveCommand[]} availableCommands
 * @param {MacroCommand} existingSample
 * @returns {MacroCommand}
 */
export function perturbSample(availableCommands, existingSample) {
    // find an available command that has a fromHex in the sample and a toHex not in the sample
    const commandToReplace = availableCommands.find((command) =>
        command.fromHex && existingSample.hasFromHex(command.fromHex) && !existingSample.hasToHex(command.toHex));

    // replace it in the new sample
    const newCommands = existingSample.commands.slice();
    newCommands[existingSample.indexOfFromHex(commandToReplace.fromHex)] = commandToReplace;
    return new MacroCommand(newCommands);
}

