import { MacroMoveNode, restructureCommands } from "ai/mcts_player.js";
import { EndPhaseCommand } from "model/commands/end_phase_command.js";
import { MacroMoveCommand } from "model/commands/macro_move_command.js";
import { MoveCommand } from "model/commands/move_command.js";
import { SkipActionCommand } from "model/commands/skip_action_command.js";
import { hexOf } from "xlib/hexlib.js";


describe('restructure commands', function () {
    test('no move commands', () => {
        const endPhaseCommand = new EndPhaseCommand();

        const result = restructureCommands([endPhaseCommand]);

        expect(result).toEqual([
            endPhaseCommand,
        ]);
    });

    test('two move commands', () => {
        const commands = [
            new MoveCommand(hexOf(0, 0), hexOf(10, 10)),
            new MoveCommand(hexOf(2, 2), hexOf(20, 20)),
        ]

        const result = restructureCommands(commands);

        expect(result.toString()).toEqual([
            new MacroMoveCommand([
                new SkipActionCommand(hexOf(10, 10)),
                new SkipActionCommand(hexOf(20, 20)),
            ]),
        ].toString());
    });
});

