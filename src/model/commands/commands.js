/*
    Commands are immutable objects representing the actions that can be taken by the player.
    They are used by both the human player and the AI to execute a move.
*/

export class Command {
    /**
     * @param {Game} game
     */
    play(game) {
        throw new Error("abstract method");
    }
}

export class FlagResult {
    constructor(damage, retreatHexes) {
        this.damage = damage;
        this.retreats = retreatHexes;
    }

    static NO_EFFECT = new FlagResult(0, []);

    toString() {
        return `FlagResult(damage: ${this.damage}, retreatHexes: ${this.retreats})`;
    }

    static retreat(hexes) {
        return new FlagResult(0, hexes);
    }

    static damage(number) {
        return new FlagResult(number, []);
    }
}

function handleFlagsNonIgnorable(flags, retreatHexesPerFlag, retreatPaths) {
    const requiredRetreat = flags * retreatHexesPerFlag;
    const damage = Math.max(0, requiredRetreat - retreatPaths.maxDistance);
    const distance = Math.min(retreatPaths.maxDistance, requiredRetreat);
    const retreatPath = (distance === 0) ? [] : retreatPaths[distance];
    return new FlagResult(damage, retreatPath);
}

function handleFlagsWithOneIgnorable(flags, retreatHexesPerFlag, retreatPaths) {
    const requiredRetreat = flags * retreatHexesPerFlag;
    const retreatWithIgnoredFlag = (flags - 1) * retreatHexesPerFlag;
    if (requiredRetreat === retreatPaths.maxDistance) {
        const notIgnoring = retreatPaths[requiredRetreat];
        const ignoring = retreatPaths[retreatWithIgnoredFlag];
        return new FlagResult(0, ignoring.concat(notIgnoring));
    }
    return handleFlagsNonIgnorable(flags - 1, retreatHexesPerFlag, retreatPaths);
}

export function handleFlags(flags, retreatHexesPerFlag, ignorableFlags, retreatPaths) {
    if (flags === 0) {
        return FlagResult.NO_EFFECT;
    }

    switch (ignorableFlags) {
        case 0:
            return handleFlagsNonIgnorable(flags, retreatHexesPerFlag, retreatPaths);
        case 1:
            return handleFlagsWithOneIgnorable(flags, retreatHexesPerFlag, retreatPaths);
        default:
            throw new Error("unsupported ignorableFlags: " + ignorableFlags);
    }
}
