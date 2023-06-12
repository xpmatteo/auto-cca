
import { Side } from "./side.js";
import { hexOf } from "../lib/hexlib.js";
import * as GameStatus from "./game_status.js";
import * as units from "./units.js";

export class NullScenario {
    get firstSide() {
        return Side.ROMAN;
    }

    placeUnitsOn(board) {
    }

    gameStatus(board) {
        return GameStatus.ONGOING;
    }
}

export class ScenarioRaceToOppositeSide {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 3;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(1, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(2, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(3, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(4, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(5, 5), new units.RomanHeavyInfantry());        
        board.placeUnit(hexOf(2, 3), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(2, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(3, 2), new units.CarthaginianHeavyInfantry());        
    }

    gameStatus(game) {
        if (game.killedUnitsOfSide(Side.CARTHAGINIAN).length === this.pointsToWin) {
            return GameStatus.ROMAN_WIN;
        }
        if (game.killedUnitsOfSide(Side.ROMAN).length === this.pointsToWin) {
            return GameStatus.CARTHAGINIAN_WIN;
        }
        return GameStatus.ONGOING;
    }
}