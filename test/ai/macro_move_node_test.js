import { MacroMoveNode } from "ai/mcts_player.js";
import { MacroMoveCommand } from "model/commands/macro_move_command.js";
import { MoveCommand } from "model/commands/move_command.js";
import { hexOf } from "xlib/hexlib.js";


describe('expanding the macro move node', function() {
    test('constructs a solution ', () => {
        const game = {
            validCommands() {
                return [
                    new MoveCommand(hexOf(0, 0), hexOf(10, 10)),
                    new MoveCommand(hexOf(2, 2), hexOf(20, 20)),
                ];
            }
        };
        const node = new MacroMoveNode(game);

        const [child] = node.expand();

        expect(child.command).toEqual(new MacroMoveCommand([
            new MoveCommand(hexOf(0, 0), hexOf(10, 10)),
            new MoveCommand(hexOf(2, 2), hexOf(20, 20)),
        ]));
    });
});

