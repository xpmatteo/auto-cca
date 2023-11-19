import { MAP_EAST, MAP_WEST } from "./board.js";
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

class Card {
    /**
     * @type {string}
     */
    name;
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
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_HEAVY)); }
}
export const ORDER_HEAVY_TROOPS_CARD = new OrderHeavyTroopsCard();

class OrderMediumTroopsCard extends Card {
    name = "Order Medium Troops";
    url = "images/cards/Order Medium Troops.gif";
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_MEDIUM)); }
}
export const ORDER_MEDIUM_TROOPS_CARD = new OrderMediumTroopsCard();

class OrderLightTroopsCard extends Card {
    name = "Order Light Troops";
    url = "images/cards/Order Light Troops.gif";
    allowsLightFootMovementThroughFriendlies = true;
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_LIGHT)); }
}
export const ORDER_LIGHT_TROOPS_CARD = new OrderLightTroopsCard();

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

class Order3LeftCard extends Card {
    name = "Order Three Units Left";
    url = "images/cards/Order 3 Left.gif";
    orderPhase(game) { return new OrderUnitsPhase(3, eligibleIfLeft); }
}
export const ORDER_3_LEFT_CARD = new Order3LeftCard();

class MoveFireMoveCard extends Card {
    name = "Move Fire Move";
    url = "images/cards/Move-Fire-Move.gif";
    allowsLightFootMovementThroughFriendlies = true;
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), eligibleByWeight(RESULT_LIGHT)); }
    phases(game) {
        return [
            new MovementPhase("1st movement"),
            new FirePhase(),
            new MovementPhase("2nd movement"),
        ];
    }
}
export const MOVE_FIRE_MOVE_CARD = new MoveFireMoveCard();
