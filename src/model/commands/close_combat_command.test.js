import { hexOf } from "../../lib/hexlib.js";
import * as dice from "../dice.js";
import { diceReturning, RESULT_FLAG, RESULT_HEAVY, RESULT_LEADER, RESULT_LIGHT } from "../dice.js";
import { DamageEvent, UnitKilledEvent } from "../events.js";
import makeGame from "../game.js";
import { MomentumAdvancePhase } from "../phases/advance_after_combat_phase.js";
import { AttackerRetreatPhase } from "../phases/attacker_retreat_phase.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { FirstDefenderRetreatPhase } from "../phases/FirstDefenderRetreatPhase.js";
import { PlayCardPhase } from "../phases/play_card_phase.js";
import { NullScenario } from "../scenarios.js";
import { Side } from "../side.js";
import * as units from "../units.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../units.js";
import { makeCloseCombatCommand } from "./close_combat_command.js";
import { makeMoveCommand } from "./move_command.js";
import { RetreatCommand } from "./retreatCommand.js";

function eventNames(events) {
    return events.map(e => e.constructor.name);
}

const attacker = new RomanHeavyInfantry();
const defender = new CarthaginianHeavyInfantry();
const closeCombatCommand = makeCloseCombatCommand(hexOf(1,4), hexOf(1, 5));

describe('defender cannot evade', () => {

    test('CloseMoveCommand creation', () => {
        const command1 = makeCloseCombatCommand(hexOf(1, 2), hexOf(1, 3));
        const command2 = makeCloseCombatCommand(hexOf(1, 2), hexOf(1, 3));

        expect(command1).toBe(command2);
    });

    describe('defender eliminated', () => {
        let game = makeGame(new NullScenario(), diceReturning(Array(5).fill(RESULT_HEAVY)));
        game.placeUnit(hexOf(1, 5), attacker);
        game.placeUnit(hexOf(1, 4), defender);

        const events = closeCombatCommand.play(game);

        test('next phase is advance after combat', () => {
            expect(game.currentPhase).toBeInstanceOf(MomentumAdvancePhase);
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

        test('attacker unit spent', () => {
            expect(game.spentUnits).toEqual([attacker]);
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

        test('attacker unit spent', () => {
            expect(game.spentUnits).toEqual([attacker]);
        });
    });

    describe('defender battles back', () => {
        const closeCombatCommand = makeCloseCombatCommand(hexOf(1,4), hexOf(1, 5));

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

            test('attacker unit spent', () => {
                expect(game.spentUnits).toEqual([attacker]);
            });
        });

        describe('attacker killed, flags irrelevant', () => {
            const defenderDice = Array(4).fill(RESULT_HEAVY).concat([RESULT_FLAG]);
            let game = makeGame(new NullScenario(), diceReturning(
                Array(5).fill(RESULT_LIGHT).concat(defenderDice)));
            game.placeUnit(hexOf(1, 5), attacker);
            game.placeUnit(hexOf(1, 4), defender);

            const events = closeCombatCommand.play(game);

            test('next phase', () => {
                expect(game.currentPhase).toBeInstanceOf(PlayCardPhase);
                expect(game.phases.length).toEqual(1);
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

            test('attacker unit spent', () => {
                expect(game.spentUnits).toEqual([attacker]);
            });
        });
    });
});

describe('flags and retreats', () => {
    test("close combat with non-ignorable flag and unblocked map NORTH", () => {
        const diceResults = [dice.RESULT_FLAG, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
        const game = makeGame(new NullScenario(), diceReturning(diceResults));
        const defendingUnit = new units.CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(0, 5), new units.RomanHeavyInfantry());
        game.placeUnit(hexOf(1, 4), defendingUnit);

        let actualEvents = game.executeCommand(makeCloseCombatCommand(hexOf(1, 4), hexOf(0, 5)));

        // now the currentside is temporarily carthago
        expect(game.currentSide).toEqual(Side.CARTHAGINIAN);

        // and the possible moves are the two retreat hexes
        const expectedValidCommands = [
            new RetreatCommand(hexOf(2, 3), hexOf(1, 4)),
            new RetreatCommand(hexOf(1, 3), hexOf(1, 4)),
        ]
        expect(game.validCommands().toString()).toEqual(expectedValidCommands.toString());

        const expectedEvents = [
            "DamageEvent",
        ];
        expect(eventNames(actualEvents)).toEqual(expectedEvents);
    });

    test("close combat with non-ignorable flag and blocked path", () => {
        const diceResults = [dice.RESULT_FLAG, dice.RESULT_FLAG, dice.RESULT_HEAVY, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
        const battleBackDiceResults = Array(5).fill(dice.RESULT_LIGHT);
        const game = makeGame(new NullScenario(), diceReturning(diceResults.concat(battleBackDiceResults)));
        const defendingUnit = new units.CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(4, 0), defendingUnit);
        const attackingUnit = new units.RomanHeavyInfantry();
        game.placeUnit(hexOf(4, 1), attackingUnit);

        let actualEvents = game.executeCommand(makeCloseCombatCommand(hexOf(4, 0), hexOf(4, 1)));

        const expectedEvents = [
            "DamageEvent",
            "BattleBackEvent",
            "DamageEvent",
        ];
        expect(eventNames(actualEvents)).toEqual(expectedEvents);
        expect(game.unitStrength(defendingUnit)).toEqual(1); // two damage from flags, one from HEAVY result
    });

    test("close combat with ignorable flag and blocked map NORTH", () => {
        const diceResults = [dice.RESULT_FLAG, dice.RESULT_FLAG, dice.RESULT_HEAVY, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
        const battleBackDiceResults = Array(5).fill(dice.RESULT_LIGHT); // no damage from battle back
        const game = makeGame(new NullScenario(), diceReturning(diceResults.concat(battleBackDiceResults)));
        const defendingUnit = new units.CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(3, 0), new units.CarthaginianLightInfantry());
        game.placeUnit(hexOf(4, 0), defendingUnit);
        game.placeUnit(hexOf(5, 0), new units.CarthaginianLightInfantry());
        const attackingUnit = new units.RomanHeavyInfantry();
        game.placeUnit(hexOf(4, 1), attackingUnit);

        let actualEvents = game.executeCommand(makeCloseCombatCommand(hexOf(4, 0), hexOf(4, 1)));

        const expectedEvents = [
            "DamageEvent",
            "BattleBackEvent",
            "DamageEvent",
        ];
        expect(eventNames(actualEvents)).toEqual(expectedEvents);
        expect(game.unitStrength(defendingUnit)).toEqual(2);  // one damage from flag, one from HEAVY result
        expect(game.unitStrength(attackingUnit)).toEqual(4);  // no damage from battle back
    });
});
