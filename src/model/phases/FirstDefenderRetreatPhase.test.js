import { InteractiveGame } from "../../interactive_game.js";
import { hexOf } from "../../lib/hexlib.js";
import { FirstDefenderRetreatCommand } from "../commands/FirstDefenderRetreatCommand.js";
import { makeIgnoreFlagAndBattleBackCommand } from "../commands/ignore_flag_and_battle_back_command.js";
import { makeRetreatCommand } from "../commands/retreatCommand.js";
import makeGame, { MovementTrail } from "../game.js";
import { NullScenario } from "../scenarios.js";
import { Side } from "../side.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../units.js";
import { BattlePhase } from "./BattlePhase.js";
import { FirstDefenderRetreatPhase } from "./FirstDefenderRetreatPhase.js";


describe('1st defender Retreat phase', () => {

    test("executing the retreat command", () => {
        let game = makeGame(new NullScenario());
        let retreatingUnit = new CarthaginianHeavyInfantry();
        let attackingUnit = new RomanHeavyInfantry();
        game.placeUnit(hexOf(1, 5), retreatingUnit);
        game.phases = [new FirstDefenderRetreatPhase(hexOf(7,7), Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]), new BattlePhase()]

        game.executeCommand(makeRetreatCommand(hexOf(1,4), hexOf(1, 5)));

        expect(game.currentPhaseName).toEqual("Roman battle");
        expect(game.unitAt(hexOf(1, 5))).toEqual(undefined);
        expect(game.unitAt(hexOf(1, 4))).toEqual(retreatingUnit);
        expect(game.movementTrails).toEqual([new MovementTrail(hexOf(1, 4), hexOf(1, 5))]);
    });

    const game = new InteractiveGame(makeGame(new NullScenario()));

    describe('when the retreating is done by the unit originally under attack', () => {
        const retreatPhase = new FirstDefenderRetreatPhase(hexOf(2,2), Side.CARTHAGINIAN, hexOf(0,0), [hexOf(0,0), hexOf(1, 1)]);

        test('retreat phase valid commands', () => {
            expect(retreatPhase.validCommands(game).toString()).toEqual([
                makeIgnoreFlagAndBattleBackCommand(hexOf(0,0), hexOf(2,2)),
                new FirstDefenderRetreatCommand(hexOf(1,1), hexOf(0,0), hexOf(2, 2)),
            ].toString());
        });

        test('hilighted hexes', () => {
            const hexes = retreatPhase.hilightedHexes(game);

            expect(hexes.size).toEqual(2);
            expect(hexes).toEqual(new Set([hexOf(0,0), hexOf(1, 1)]));
        });

        test('on click', () => {
            expect(retreatPhase.onClick(hexOf(1, 1), game).toString()).toEqual(
                [makeRetreatCommand(hexOf(1,1), hexOf(0,0))].toString()
            );

            expect(retreatPhase.onClick(hexOf(0, 0), game).toString()).toEqual(
                [makeIgnoreFlagAndBattleBackCommand(hexOf(0,0), hexOf(2,2))].toString()
            );
        });
    });

    describe('when the retreating is done as a consequence of battle back', () => {
        const retreatPhase = new FirstDefenderRetreatPhase(null, Side.ROMAN, hexOf(0,0), [hexOf(0,0), hexOf(1, 1)]);

        test('retreat phase valid commands', () => {
            expect(retreatPhase.validCommands(game).toString()).toEqual([
                makeRetreatCommand(hexOf(0, 0), hexOf(0,0)),
                makeRetreatCommand(hexOf(1,1), hexOf(0,0)),
            ].toString());
        });

        test('hilighted hexes', () => {
            const hexes = retreatPhase.hilightedHexes(game);

            expect(hexes).toEqual(new Set([hexOf(0,0), hexOf(1, 1)]));
        });

        // we should move command execution up the call stack so that we avoid entangling
        // the phase too much with changing the game state
        // onClick should only return a command to execute
        test('on click', () => {
            expect(retreatPhase.onClick(hexOf(1, 1), game).toString()).toEqual(
                [makeRetreatCommand(hexOf(1,1), hexOf(0,0))].toString()
            );

            expect(retreatPhase.onClick(hexOf(0, 0), game).toString()).toEqual(
                [makeRetreatCommand(hexOf(0,0), hexOf(0,0))].toString()
            );
        });
    });
});
