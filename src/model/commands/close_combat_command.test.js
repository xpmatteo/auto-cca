import { hexOf } from "../../lib/hexlib.js";
import { diceReturningAlways } from "../dice.js";
import { FirstDefenderEvasionPhase } from "../phases/first_defender_evasion_phase.js";
import { CloseCombatCommand } from "./close_combat_command.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, CarthaginianLightInfantry, RomanHeavyInfantry } from "../units.js";

test("marks units spent", () => {
    let game = makeGame(new NullScenario());
    let unit = new RomanHeavyInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.placeUnit(hexOf(1, 4), target);

    game.executeCommand(new CloseCombatCommand(hexOf(1,4), hexOf(1, 5)));

    expect(game.spentUnits).toEqual([unit]);
});

test('defender can evade', () => {
    let game = makeGame(new NullScenario());
    let attacker = new RomanHeavyInfantry();
    let defender = new CarthaginianLightInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 4), defender);
    const closeCombatCommand = new CloseCombatCommand(hexOf(1,4), hexOf(1, 5));

    closeCombatCommand.play(game);

    expect(game.currentPhase).toBeInstanceOf(FirstDefenderEvasionPhase);
    expect(game.phases.length).toEqual(2);
});

describe('defender cannot evade', () => {

    test('defender eliminated', () => {
        let game = makeGame(new NullScenario(), diceReturningAlways());
        let attacker = new RomanHeavyInfantry();
        let defender = new CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(1, 5), attacker);
        game.placeUnit(hexOf(1, 4), defender);
        const closeCombatCommand = new CloseCombatCommand(hexOf(1,4), hexOf(1, 5));

        closeCombatCommand.play(game);

        expect(game.currentPhase).toBeInstanceOf(FirstDefenderEvasionPhase);
        expect(game.phases.length).toEqual(2);
    });

});

