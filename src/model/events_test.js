import { BattleBackEvent, DamageEvent, MutualDamageEvent } from "./events.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "./units.js";
import { hexOf } from "../lib/hexlib.js";


let attackingUnit = new RomanLightInfantry();
let defendingUnit = new CarthaginianHeavyInfantry();

function aDamageEvent(hex) {
    return new DamageEvent(new RomanLightInfantry(), new CarthaginianHeavyInfantry(), hex, 3, []);
}

test('add damage event removes previous events', () => {
    const decorationsList = [aDamageEvent(hexOf(0, 0))]
    const newDamageEvent = new DamageEvent(attackingUnit, defendingUnit, hexOf(1, 1), 2, []);

    newDamageEvent.addDecorations(decorationsList);

    expect(decorationsList).toEqual([newDamageEvent]);
});

xtest('reciprocal damage from battle back', () => {
    const attackingHex = hexOf(1, 1);
    const defendingHex = hexOf(1, 2);
    const firstDamageEvent = new DamageEvent(attackingUnit, defendingUnit, defendingHex, 2, []);
    const battleBackEvent = new BattleBackEvent(defendingHex, attackingHex, 5);
    const battleBackDamageEvent = new DamageEvent(defendingUnit, attackingUnit, attackingHex, 3, []);
    const decorationsList = [battleBackEvent, firstDamageEvent]

    battleBackDamageEvent.addDecorations(decorationsList);

    expect(decorationsList).toEqual([new MutualDamageEvent(attackingUnit, 3, defendingUnit, 2)]);
});
