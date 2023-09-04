import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";
import { CloseCombatCommand } from "model/commands/close_combat_command.js";
import { Side } from "model/side.js";

test("CloseCombatCommand play", () => {
    let game = makeGame(new NullScenario());
    let unit = new RomanHeavyInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.placeUnit(hexOf(1, 4), target);

    game.executeCommand(new CloseCombatCommand(hexOf(1,4), hexOf(1, 5)));

    expect(game.spentUnits).toEqual([unit]);
});


test("value of CloseCombatCommand", () => {
    let game = makeGame(new NullScenario());
    let attacker = new RomanHeavyInfantry();
    let defender = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 4), defender);
    let command = new CloseCombatCommand(hexOf(1, 4), hexOf(1, 5));
    expect(game.currentSide).toEqual(Side.ROMAN);

    // value is 1000 / defender strength
    expect(command.value(game)).toEqual(250);
});
