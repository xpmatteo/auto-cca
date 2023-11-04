import { InteractiveGame } from "../../interactive_game.js";
import { hexOf } from "../../lib/hexlib.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import makeGame, { MovementTrail } from "../game.js";
import { IgnoreFlagAndBattleBackCommand } from "../commands/abstract_combat_command.js";
import { NullScenario } from "../scenarios.js";
import { Side } from "../side.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../units.js";
import { BattlePhase } from "./BattlePhase.js";
import { RetreatPhase } from "./RetreatPhase.js";


describe('Retreat phase', () => {

    test("Retreat play", () => {
        let game = makeGame(new NullScenario());
        let retreatingUnit = new CarthaginianHeavyInfantry();
        let attackingUnit = new RomanHeavyInfantry();
        game.placeUnit(hexOf(1, 5), retreatingUnit);
        game.phases = [new RetreatPhase(hexOf(7,7), Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]), new BattlePhase()]

        game.executeCommand(new RetreatCommand(hexOf(1,4), hexOf(1, 5)));

        expect(game.currentPhaseName).toEqual("Roman battle");
        expect(game.unitAt(hexOf(1, 5))).toEqual(undefined);
        expect(game.unitAt(hexOf(1, 4))).toEqual(retreatingUnit);
        expect(game.movementTrails).toEqual([new MovementTrail(hexOf(1, 4), hexOf(1, 5))]);
    });

    const retreatPhase = new RetreatPhase(hexOf(2,2), Side.CARTHAGINIAN, hexOf(0,0), [hexOf(0,0), hexOf(1, 1)]);
    const game = new InteractiveGame(makeGame(new NullScenario()));

    test('retreat phase valid commands', () => {
        expect(retreatPhase.validCommands(game).toString()).toEqual([
            new IgnoreFlagAndBattleBackCommand(hexOf(0,0), hexOf(2,2)),
            new RetreatCommand(hexOf(1,1), hexOf(0,0)),
        ].toString());
    });

    test('hilighted hexes', () => {
        const hexes = retreatPhase.hilightedHexes(game);

        expect(hexes.size).toEqual(2);
        expect(hexes).toEqual(new Set([hexOf(0,0), hexOf(1, 1)]));
    });

    // we should move command execution up the call stack so that we avoid entangling
    // the phase too much with changing the game state
    // onClick should only return a command to execute
    xtest('on click', () => {
        expect(retreatPhase.onClick(hexOf(1, 1), game).toString()).toEqual(
            [new RetreatCommand(hexOf(1,1), hexOf(0,0))].toString()
        );

        expect(retreatPhase.onClick(hexOf(0, 0), game).toString()).toEqual(
            [new IgnoreFlagAndBattleBackCommand(hexOf(0,0), hexOf(2,2))].toString()
        );
    });

});
