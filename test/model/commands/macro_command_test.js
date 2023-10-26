
import { jest } from '@jest/globals';
import { MacroCommand } from "model/commands/macro_command.js";


test('executes all commands, collecting game events', () => {
    const game = {
        endPhase: jest.fn(),
    };
    const commands = [
        { play: jest.fn(() => [1, 2]), isDeterministic: () => true },
        { play: jest.fn(() => [3, 4]), isDeterministic: () => true },
    ];
    const macroCommand = new MacroCommand(commands);

    const events = macroCommand.play(game);

    expect(events).toEqual([1, 2, 3, 4]);
    expect(commands[0].play).toHaveBeenCalledTimes(1);
    expect(commands[1].play).toHaveBeenCalledTimes(1);
    expect(game.endPhase).toHaveBeenCalledTimes(1);
});

test('stops after the first non-deterministic command', () => {
    const game = {
        endPhase: jest.fn(),
    };
    const commands = [
        { play: jest.fn(() => [1, 2]), isDeterministic: () => true },
        { play: jest.fn(() => [3, 4]), isDeterministic: () => false },
        { play: jest.fn(() => [5, 6]), isDeterministic: () => true },
    ];
    const macroCommand = new MacroCommand(commands);

    const events = macroCommand.play(game);

    expect(events).toEqual([1, 2, 3, 4]);
    expect(commands[0].play).toHaveBeenCalledTimes(1);
    expect(commands[1].play).toHaveBeenCalledTimes(1);
    expect(commands[2].play).toHaveBeenCalledTimes(0);
    expect(game.endPhase).toHaveBeenCalledTimes(0);
});
