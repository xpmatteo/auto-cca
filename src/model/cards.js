import { OrderUnitsPhase } from "./phases/order_units_phase.js";
import { RESULT_HEAVY, RESULT_LIGHT, RESULT_MEDIUM } from "./dice.js";
import { Point } from "../lib/hexlib.js";
import { MovementPhase } from "./phases/MovementPhase.js";
import { BattlePhase } from "./phases/BattlePhase.js";
import { FirePhase } from "./phases/fire_phase.js";

/*
    Cards are used to order units during the order phase.
    They determine the structure of the turn.
    Most turns will have a MovementPhase followed by a BattlePhase, but some cards
    have different turn structures.

    Cards are stateless and immutable.
*/

export const CARD_IMAGE_SIZE = new Point(400, 560);
class Card {
    phases(game) {
        return [
            new MovementPhase(),
            new BattlePhase(),
        ];
    }
}

export class OrderHeavyTroopsCard extends Card {
    name = "Order Heavy Troops";
    url = "images/cards/Order Heavy Troops.gif";
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), RESULT_HEAVY); }
}

export class OrderMediumTroopsCard extends Card {
    name = "Order Medium Troops";
    url = "images/cards/Order Medium Troops.gif";
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), RESULT_MEDIUM); }
}

export class OrderLightTroopsCard extends Card {
    name = "Order Light Troops";
    url = "images/cards/Order Light Troops.gif";
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), RESULT_LIGHT); }
}

export class MoveFireMoveCard extends Card {
    name = "Move Fire Move";
    url = "images/cards/Move-Fire-Move.gif";
    orderPhase(game) { return new OrderUnitsPhase(game.commandSize(), RESULT_LIGHT); }
    phases(game) {
        return [
            new MovementPhase("1st movement"),
            new FirePhase(),
            new MovementPhase("2nd movement"),
        ];
    }
}
