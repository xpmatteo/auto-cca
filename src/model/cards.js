import { MAP_CENTER, MAP_EAST, MAP_WEST } from "./board.js";
import { RESULT_HEAVY, RESULT_LIGHT, RESULT_MEDIUM } from "./dice.js";
import { BattlePhase } from "./phases/BattlePhase.js";
import { FirePhase } from "./phases/fire_phase.js";
import { MovementPhase } from "./phases/MovementPhase.js";
import { OrderUnitsPhase } from "./phases/order_units_phase.js";

/*
    Cards are used to order units during the order phase.
    They determine the structure of the turn.
    Most turns will have a MovementPhase followed by a BattlePhase, but some cards
    have different turn structures.

    Cards are stateless and immutable.
*/

export class Card {
    /** @type {string} */
    name;

    /**
     * 100 - 199: left cards
     * 200 - 299: center cards
     * 300 - 399: right cards
     * 400 - 499: troop cards
     * 500 - 599: tactic cards
     * @type {number}
     */
    order= 0;

    phases(game) {
        return [
            new MovementPhase(),
            new BattlePhase(),
        ];
    }

    toString() {
        return this.name;
    }

    orderPhase(game) {
        throw new Error("Must be implemented by subclass");
    }

    eligibleUnits(game) {
        return this.orderPhase(game).__eligibleUnits(game);
    }
}

function eligibleByWeight(weight) {
    return (unit, game) => unit.weight === weight;
}

class OrderHeavyTroopsCard extends Card {
    name = "Order Heavy Troops";
    url = "images/cards/Order Heavy Troops.gif";
    order = 400;
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_HEAVY)); }
}
export const ORDER_HEAVY_TROOPS_CARD = new OrderHeavyTroopsCard();

class OrderMediumTroopsCard extends Card {
    name = "Order Medium Troops";
    url = "images/cards/Order Medium Troops.gif";
    order = 401;
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_MEDIUM)); }
}
export const ORDER_MEDIUM_TROOPS_CARD = new OrderMediumTroopsCard();

class OrderLightTroopsCard extends Card {
    name = "Order Light Troops";
    url = "images/cards/Order Light Troops.gif";
    allowsLightFootMovementThroughFriendlies = true;
    order = 402;
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_LIGHT)); }
}
export const ORDER_LIGHT_TROOPS_CARD = new OrderLightTroopsCard();

export const ORDER_MOUNTED_CARD = {
    name: "Order Mounted",
    url: "images/cards/Order Mounted.gif",
    order: 403,
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleIfMounted); },
    __proto__: Card.prototype,
}

/**
 * @param {Unit} unit
 * @param {Game} game
 */
function eligibleIfLeft(unit, game) {
    if (unit.side === game.sideNorth) {
        return MAP_EAST.has(game.hexOfUnit(unit));
    }
    return MAP_WEST.has(game.hexOfUnit(unit));
}

/**
 * @param {Unit} unit
 * @param {Game} game
 */
function eligibleIfRight(unit, game) {
    if (unit.side === game.sideNorth) {
        return MAP_WEST.has(game.hexOfUnit(unit));
    }
    return MAP_EAST.has(game.hexOfUnit(unit));
}

/**
 * @param {Unit} unit
 * @param {Game} game
 */
function eligibleIfCenter(unit, game) {
    return MAP_CENTER.has(game.hexOfUnit(unit));
}

/**
 * @param {Unit} unit
 * @param {Game} game
 */
function eligibleIfRanged(unit, game) {
    return unit.isRanged();
}

/**
 * @param {Unit} unit
 * @param {Game} game
 */
function eligibleIfMounted(unit, game) {
    return unit.isMountedUnit();
}

export const ORDER_4_LEFT_CARD = {
    name: "Order Four Units Left",
    url: "images/cards/Order 4 Left.gif",
    order: 100,
    orderPhase(game) { return new OrderUnitsPhase(4, eligibleIfLeft); },
    __proto__: Card.prototype,
};

export const ORDER_3_LEFT_CARD = {
    name: "Order Three Units Left",
    url: "images/cards/Order 3 Left.gif",
    order: 101,
    orderPhase(game) { return new OrderUnitsPhase(3, eligibleIfLeft); },
    __proto__: Card.prototype,
};

export const ORDER_2_LEFT_CARD = {
    name: "Order Two Units Left",
    url: "images/cards/Order 2 Left.gif",
    order: 102,
    orderPhase(game) { return new OrderUnitsPhase(2, eligibleIfLeft); },
    __proto__: Card.prototype,
};

export const ORDER_4_RIGHT_CARD = {
    name: "Order Four Units Right",
    url: "images/cards/Order 4 Right.gif",
    order: 300,
    orderPhase(game) { return new OrderUnitsPhase(4, eligibleIfRight); },
    __proto__: Card.prototype,
};

export const ORDER_3_RIGHT_CARD = {
    name: "Order Three Units Right",
    url: "images/cards/Order 3 Right.gif",
    order: 301,
    orderPhase(game) { return new OrderUnitsPhase(3, eligibleIfRight); },
    __proto__: Card.prototype,
};

export const ORDER_2_RIGHT_CARD = {
    name: "Order Two Units Right",
    url: "images/cards/Order 2 Right.gif",
    order: 302,
    orderPhase(game) { return new OrderUnitsPhase(2, eligibleIfRight); },
    __proto__: Card.prototype,
};

export const ORDER_4_CENTER_CARD = {
    name: "Order Four Units Center",
    url: "images/cards/Order 4 Center.gif",
    order: 200,
    orderPhase(game) { return new OrderUnitsPhase(4, eligibleIfCenter); },
    __proto__: Card.prototype,
};

export const ORDER_3_CENTER_CARD = {
    name: "Order Three Units Center",
    url: "images/cards/Order 3 Center.gif",
    order: 201,
    orderPhase(game) { return new OrderUnitsPhase(3, eligibleIfCenter); },
    __proto__: Card.prototype,
};

export const ORDER_2_CENTER_CARD = {
    name: "Order Two Units Center",
    url: "images/cards/Order 2 Center.gif",
    order: 202,
    orderPhase(game) { return new OrderUnitsPhase(2, eligibleIfCenter); },
    __proto__: Card.prototype,
};

class MoveFireMoveCard extends Card {
    name = "Move Fire Move";
    url = "images/cards/Move-Fire-Move.gif";
    allowsLightFootMovementThroughFriendlies = true;
    order = 510;
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_LIGHT)); }
    phases(game) {
        return [
            new MovementPhase("1st movement"),
            new FirePhase("fire"),
            new MovementPhase("2nd movement"),
        ];
    }
}
export const MOVE_FIRE_MOVE_CARD = new MoveFireMoveCard();

export const DARKEN_THE_SKY_CARD = {
    name: "Darken the Sky",
    url: "images/cards/Darken the Sky.gif",
    order: 510,
    orderPhase(game) { return new OrderUnitsPhase(100, eligibleIfRanged); },
    phases(game) {
        return [
            new FirePhase("1st fire"),
            new FirePhase("2nd fire"),
        ];
    },
    __proto__: Card.prototype
};
