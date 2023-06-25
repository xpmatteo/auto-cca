
import { Side } from "./side.js";
import { hexOf } from "../lib/hexlib.js";
import GameStatus from "./game_status.js";
import * as units from "./units.js";

export class Scenario {
    opposingSide(side) {
        return side === this.sideNorth ? this.sideSouth : this.sideNorth;
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

export class NullScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 3;

    placeUnitsOn(board) {
    }

    gameStatus(board) {
        return GameStatus.ONGOING;
    }
}

export class TestScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 3;
    maxTurns = 6;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(1, 5), new units.RomanLightInfantry());
        board.placeUnit(hexOf(2, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(3, 5), new units.RomanHeavyInfantry());
        // board.placeUnit(hexOf(4, 5), new units.RomanHeavyInfantry());
        // board.placeUnit(hexOf(3, 6), new units.RomanHeavyCavalry());
        board.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(2, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(3, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 2), new units.CarthaginianMediumInfantry());
        board.placeUnit(hexOf(5, 2), new units.CarthaginianMediumInfantry());
        board.placeUnit(hexOf(6, 2), new units.CarthaginianMediumInfantry());
    }

    gameStatus(game) {
        if (game.turnCount > this.maxTurns) {
            return GameStatus.ROMAN_WIN;
        }
        if (game.killedUnitsOfSide(Side.CARTHAGINIAN).length === this.pointsToWin) {
            return GameStatus.ROMAN_WIN;
        }
        if (game.killedUnitsOfSide(Side.ROMAN).length === this.pointsToWin) {
            return GameStatus.CARTHAGINIAN_WIN;
        }
        return GameStatus.ONGOING;
    }
}