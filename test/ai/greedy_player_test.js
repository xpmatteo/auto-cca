import { GreedyPlayer } from "ai/greedy_player.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { hexOf } from "xlib/hexlib.js";
import { RomanHeavyInfantry } from "model/units.js";
import { score } from "ai/score.js";
import { Side } from "model/side.js";
import { MoveCommand } from "model/commands/move_command.js";
import { MovementPhase } from "model/phases/MovementPhase.js";


test("greedy_player", function() {
    const player = new GreedyPlayer();
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry()); // has support
    game.placeUnit(hexOf(1, 0), new RomanHeavyInfantry()); // has support
    game.placeUnit(hexOf(0, 1), new RomanHeavyInfantry()); // has support
    game.placeUnit(hexOf(2, 1), new RomanHeavyInfantry()); // one hex away
    expect(score(game, Side.ROMAN)).toBe(1);
    game.foreachUnit((unit, hex) => game.orderUnit(hex))
    game.phases = [new MovementPhase(game)]

    const result = player.decideMove(game);

    // the best move is to move the one separate unit close to its friends, so that
    // we get one additional supported unit
    expect(result.toString()).toEqual(new MoveCommand(hexOf(1, 1), hexOf(2, 1)).toString());
});
