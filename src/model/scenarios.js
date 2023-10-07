import { hexOf } from "../lib/hexlib.js";
import GameStatus from "./game_status.js";
import { Side } from "./side.js";
import * as units from "./units.js";

export class Scenario {
    /**
     * @param side
     * @returns {Side}
     */
    opposingSide(side) {
        return side === this.sideNorth ? this.sideSouth : this.sideNorth;
    }

    /**
     * @param {Game} game
     * @returns {GameStatus}
     */
    gameStatus(game) {
        if (game.killedUnitsOfSide(Side.CARTHAGINIAN).length === this.pointsToWin) {
            return GameStatus.ROMAN_WIN;
        }
        if (game.killedUnitsOfSide(Side.ROMAN).length === this.pointsToWin) {
            return GameStatus.CARTHAGINIAN_WIN;
        }
        return GameStatus.ONGOING;
    }

    /**
     * @param {Board|Game} board
     */
    placeUnitsOn(board) {
        throw new Error("Subclass must implement");
    }
}

export class NullScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 3;
    commandNorth = 1;
    commandSouth = 1;

    placeUnitsOn(board) {
    }

    gameStatus(board) {
        return GameStatus.ONGOING;
    }
}

export class MeleeScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 3;
    commandNorth = 4;
    commandSouth = 3;

    placeUnitsOn(board) {
        // 1522
        board.placeUnit(hexOf(0, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(1, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(2, 5), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(3, 5), new units.RomanHeavyInfantry());

        // 6422
        // board.placeUnit(hexOf(1, 4), new units.RomanHeavyInfantry());
        // board.placeUnit(hexOf(2, 4), new units.RomanHeavyInfantry());
        // board.placeUnit(hexOf(3, 4), new units.RomanHeavyInfantry());
        // board.placeUnit(hexOf(4, 4), new units.RomanHeavyInfantry());

        board.placeUnit(hexOf(2, 3), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 3), new units.CarthaginianHeavyInfantry());
    }
}

export class OneToOneMeleeScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 1;
    commandNorth = 3;
    commandSouth = 3;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(2, 2), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(1, 4), new units.RomanLightBowsInfantry());
    }
}

export class TwoOnTwoMeleeScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 2;
    commandNorth = 4;
    commandSouth = 3;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(-1, 6), new units.RomanHeavyInfantry());
        board.placeUnit(hexOf(0, 6), new units.RomanHeavyInfantry());

        board.placeUnit(hexOf(0, 4), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(1, 4), new units.CarthaginianHeavyInfantry());
    }
}


export class AkragasScenario extends Scenario {
    firstSide = Side.SYRACUSAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.SYRACUSAN;
    pointsToWin = 5;
    commandNorth = 5;
    commandSouth = 6;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(1, 1), new units.CarthaginianMediumInfantry());
        board.placeUnit(hexOf(2, 1), new units.CarthaginianAuxiliaInfantry());
        board.placeUnit(hexOf(3, 1), new units.CarthaginianHeavyInfantry());
        board.placeUnit(hexOf(4, 1), new units.CarthaginianMediumInfantry());
        board.placeUnit(hexOf(6, 1), new units.CarthaginianAuxiliaInfantry());
        board.placeUnit(hexOf(7, 1), new units.CarthaginianAuxiliaInfantry());
        board.placeUnit(hexOf(8, 1), new units.CarthaginianAuxiliaInfantry());

        board.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyChariot());
        board.placeUnit(hexOf(3, 2), new units.CarthaginianLightBowsInfantry());
        board.placeUnit(hexOf(7, 2), new units.CarthaginianLightInfantry());
        board.placeUnit(hexOf(9, 2), new units.CarthaginianHeavyChariot());
        board.placeUnit(hexOf(10, 1), new units.CarthaginianLightCavalry());

        function placeSyracusanUnit(hex, unit) {
            board.placeUnit(hex, unit);
            unit.side = Side.SYRACUSAN;
        }
        placeSyracusanUnit(hexOf(-2, 7), new units.RomanLightCavalry());
        placeSyracusanUnit(hexOf(-1, 7), new units.RomanAuxiliaInfantry());
        placeSyracusanUnit(hexOf(0, 7), new units.RomanHeavyInfantry());
        placeSyracusanUnit(hexOf(2, 7), new units.RomanHeavyInfantry());
        placeSyracusanUnit(hexOf(3, 7), new units.RomanHeavyInfantry());
        placeSyracusanUnit(hexOf(4, 7), new units.RomanHeavyInfantry());
        placeSyracusanUnit(hexOf(5, 7), new units.RomanAuxiliaInfantry());
        placeSyracusanUnit(hexOf(6, 7), new units.RomanAuxiliaInfantry());
        placeSyracusanUnit(hexOf(7, 7), new units.RomanMediumCavalry());

        placeSyracusanUnit(hexOf(0, 6), new units.RomanLightBowsInfantry());
        placeSyracusanUnit(hexOf(3, 6), new units.RomanLightBowsInfantry());
        placeSyracusanUnit(hexOf(7, 6), new units.RomanLightInfantry());
    }
}

const SCENARIOS = {
    akragas: new AkragasScenario(),
    melee: new MeleeScenario(),
    oneToOneMelee: new OneToOneMeleeScenario(),
    twoOnTwoMelee: new TwoOnTwoMeleeScenario(),
}

export function makeScenario(name) {
    return SCENARIOS[name] || new AkragasScenario();
}
