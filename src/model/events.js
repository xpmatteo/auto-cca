
export class DamageEvent {
    constructor(hex, damage, diceResults) {
        this.hex = hex;
        this.damage = damage;
        this.diceResults = diceResults.slice();
    }

    toString() {
        this.diceResults.sort();
        return `Damage ${this.hex} for ${this.damage} with ${this.diceResults}`;
    }
}

export class BattleBackEvent {
    constructor(hexTo, hexFrom, diceCount) {
        this.hexTo = hexTo;
        this.hexFrom = hexFrom;
        this.diceCount = diceCount;
    }

    toString() {
        return `Battle back from ${this.hexFrom} to ${this.hexTo} for ${this.diceCount}`;
    }
}