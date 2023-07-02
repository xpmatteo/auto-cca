
import { Side } from "./side.js";
import { hexOf } from "../lib/hexlib.js";
import GameStatus from "./game_status.js";
import * as units from "./units.js";
import { CarthaginianAuxiliaInfantry } from "./units.js";

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

    placeUnitsOn(board) {
        board.placeUnit(hexOf(1, 4), new units.RomanLightInfantry());
        board.placeUnit(hexOf(2, 4), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(3, 4), new units.RomanHeavyInfantry());

        board.placeUnit(hexOf(1, 3), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(2, 3), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 3), new units.CarthaginianHeavyInfantry());
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

export class AkragasScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 5;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(1, 1), new units.CarthaginianMediumInfantry());
        board.placeUnit(hexOf(2, 1), new units.CarthaginianAuxiliaInfantry());
        board.placeUnit(hexOf(3, 1), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 1), new units.CarthaginianMediumInfantry());
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