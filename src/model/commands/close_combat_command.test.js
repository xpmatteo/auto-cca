import { hexOf } from "../../lib/hexlib.js";
import { diceReturning, RESULT_FLAG, RESULT_HEAVY, RESULT_LEADER, RESULT_LIGHT, RESULT_MEDIUM } from "../dice.js";
import { DamageEvent, UnitKilledEvent } from "../events.js";
import { AdvanceAfterCombatPhase } from "../phases/advance_after_combat_phase.js";
import { AttackerRetreatPhase } from "../phases/attacker_retreat_phase.js";
import { FirstDefenderEvasionPhase } from "../phases/first_defender_evasion_phase.js";
import { PlayCardPhase } from "../phases/play_card_phase.js";
import { FirstDefenderRetreatPhase } from "../phases/FirstDefenderRetreatPhase.js";
import { Side } from "../side.js";
import { CloseCombatCommand } from "./close_combat_command.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import {
    CarthaginianHeavyInfantry,
    CarthaginianLightInfantry, CarthaginianMediumInfantry,
    RomanHeavyInfantry,
    RomanMediumInfantry
} from "../units.js";

function eventNames(events) {
    return events.map(e => e.constructor.name);
}

const attacker = new RomanHeavyInfantry();
const defender = new CarthaginianHeavyInfantry();
const closeCombatCommand = new CloseCombatCommand(hexOf(1,4), hexOf(1, 5));

test("marks units spent", () => {
    let game = makeGame(new NullScenario());
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 4), defender);

    game.executeCommand(closeCombatCommand);

    expect(game.spentUnits).toEqual([attacker]);
});

test('defender can evade', () => {
    let game = makeGame(new NullScenario());
    const attacker = new RomanHeavyInfantry();
    const defender = new CarthaginianLightInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 4), defender);

    closeCombatCommand.play(game);

    expect(game.currentPhase).toBeInstanceOf(FirstDefenderEvasionPhase);
    expect(game.phases.length).toEqual(2);
});

describe('defender cannot evade', () => {

    describe('defender eliminated', () => {
        let game = makeGame(new NullScenario(), diceReturning(Array(5).fill(RESULT_HEAVY)));
        game.placeUnit(hexOf(1, 5), attacker);
        game.placeUnit(hexOf(1, 4), defender);

        const events = closeCombatCommand.play(game);

        test('next phase is advance after combat', () => {
            expect(game.currentPhase).toBeInstanceOf(AdvanceAfterCombatPhase);
            expect(game.phases.length).toEqual(2);
        });

        test('events generated', () => {
            expect(eventNames(events)).toEqual(["DamageEvent", "UnitKilledEvent"]);
            expect(events[0].toString()).toStrictEqual("Roman heavy infantry damages Carthaginian heavy infantry at [1,4] for 5 damage with heavy,heavy,heavy,heavy,heavy");
        });

        test('defender is killed', () => {
            expect(game.unitAt(hexOf(1, 4))).toBeUndefined();
            expect(game.killedUnitsOfSide(Side.CARTHAGINIAN)).toEqual([defender]);
        });
    });

    describe('defender retreats', () => {
        let game = makeGame(new NullScenario(), diceReturning([
            RESULT_FLAG, RESULT_LEADER, RESULT_LEADER, RESULT_LEADER, RESULT_LEADER]));
        game.placeUnit(hexOf(1, 5), attacker);
        game.placeUnit(hexOf(1, 4), defender);

        const events = closeCombatCommand.play(game);

        test('next phase', () => {
            expect(game.currentPhase).toBeInstanceOf(FirstDefenderRetreatPhase);
            expect(game.phases.length).toEqual(2);
        });

        test('events generated', () => {
            expect(eventNames(events)).toEqual(["DamageEvent"]);
            expect(events[0].toString()).toEqual("Roman heavy infantry damages Carthaginian heavy infantry at [1,4] for 0 damage with flag,leader,leader,leader,leader");
        });

        test('defender is still there', () => {
            expect(game.unitAt(hexOf(1, 4))).toBe(defender);
        });
    });

    describe('defender battles back', () => {
        const closeCombatCommand = new CloseCombatCommand(hexOf(1,4), hexOf(1, 5));

        describe('attacker killed', () => {
            let game = makeGame(new NullScenario(), diceReturning(Array(5).fill(RESULT_LIGHT).concat(Array(5).fill(RESULT_HEAVY))));
            game.placeUnit(hexOf(1, 5), attacker);
            game.placeUnit(hexOf(1, 4), defender);

            const events = closeCombatCommand.play(game);

            test('next phase', () => {
                expect(game.currentPhase).toBeInstanceOf(PlayCardPhase);
                expect(game.phases.length).toEqual(1);
            });

            test('events generated', () => {
                expect(eventNames(events)).toEqual(["DamageEvent", "BattleBackEvent", "DamageEvent", "UnitKilledEvent"]);
            });

            test('attacker killed', () => {
                expect(game.unitAt(hexOf(1, 4))).toBe(defender);
                expect(game.unitAt(hexOf(1, 5))).toBeUndefined();
                expect(game.killedUnitsOfSide(Side.ROMAN)).toEqual([attacker]);
            });

        });

        describe('attacker retreats', () => {
            let game = makeGame(new NullScenario(), diceReturning([
                RESULT_LIGHT, RESULT_LIGHT,RESULT_LIGHT,RESULT_LIGHT,RESULT_LIGHT,
                RESULT_FLAG, RESULT_LIGHT,RESULT_LIGHT,RESULT_LIGHT,RESULT_LIGHT,
            ]));
            game.placeUnit(hexOf(1, 5), attacker);
            game.placeUnit(hexOf(1, 4), defender);

            const events = closeCombatCommand.play(game);

            test('next phase', () => {
                expect(game.currentPhase).toBeInstanceOf(AttackerRetreatPhase);
                expect(game.phases.length).toEqual(2);
            });

            test('events generated', () => {
                expect(eventNames(events)).toEqual(["DamageEvent", "BattleBackEvent", "DamageEvent"]);
            });

            test('both units stay', () => {
                expect(game.unitAt(hexOf(1, 4))).toBe(defender);
                expect(game.unitAt(hexOf(1, 5))).toBe(attacker);
            });
        });
    });
});

