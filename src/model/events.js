
export class DamageEvent {
    constructor(hex, damage, diceResults) {
        this.hex = hex;
        this.damage = damage;
        this.diceResults = diceResults;
    }

    toString() {
        return `Damage ${this.damage} to ${this.hex}`;
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