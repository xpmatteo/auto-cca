import { hexOf } from "../../lib/hexlib.js";
import { diceReturning, RESULT_HEAVY } from "../dice.js";
import { DamageEvent, UnitKilledEvent } from "../events.js";
import { AdvanceAfterCombatPhase } from "../phases/advance_after_combat_phase.js";
import { FirstDefenderEvasionPhase } from "../phases/first_defender_evasion_phase.js";
import { CloseCombatCommand } from "./close_combat_command.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, CarthaginianLightInfantry, RomanHeavyInfantry } from "../units.js";

function eventNames(events) {
    return events.map(e => e.constructor.name);
}

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
        let game = makeGame(new NullScenario(), diceReturning(Array(5).fill(RESULT_HEAVY)));
        let attacker = new RomanHeavyInfantry();
        let defender = new CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(1, 5), attacker);
        game.placeUnit(hexOf(1, 4), defender);
        const closeCombatCommand = new CloseCombatCommand(hexOf(1,4), hexOf(1, 5));

        const events = closeCombatCommand.play(game);

        expect(game.currentPhase).toBeInstanceOf(AdvanceAfterCombatPhase);
        expect(eventNames(events)).toEqual(["DamageEvent", "UnitKilledEvent"]);
        expect(events[0].toString()).toStrictEqual("Roman heavy infantry damages Carthaginian heavy infantry at [1,4] for 5 damage with heavy,heavy,heavy,heavy,heavy");
        expect(game.phases.length).toEqual(2);
    });

});

