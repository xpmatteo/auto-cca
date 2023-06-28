
export class DamageEvent {
    constructor(attackingUnit, defendingUnit, hex, damage, diceResults) {
        this.attackingUnit = attackingUnit;
        this.defendingUnit = defendingUnit;
        this.hex = hex;
        this.damage = damage;
        this.diceResults = diceResults.slice();
    }

    toString() {        
        return `${this.attackingUnit} damages ${this.defendingUnit} at ${this.hex} for ${this.damage} damage with ${this.diceResults}`;
    }
}

export class BattleBackEvent {
    constructor(hexTo, hexFrom, diceCount) {
        this.hexTo = hexTo;
        this.hexFrom = hexFrom;
        this.diceCount = diceCount;
    }

    toString() {
        return `Battle back from ${this.hexFrom} to ${this.hexTo} with ${this.diceCount} dice`;
    }
}

export class UnitKilledEvent {
    constructor(hex, unit) {
        this.unit = unit;
        this.hex = hex;
    }

    toString() {
        return `${this.unit} killed at ${this.hex}`;
    }
}