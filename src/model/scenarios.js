
import { Side } from "./side.js";
import { hexOf } from "../lib/hexlib.js";
import * as GameStatus from "./game_status.js";
import * as units from "./units.js";

export class ScenarioRaceToOppositeSide {
    get firstSide() {
        return Side.ROMAN;
    }

    placeUnitsOn(board) {
        board.addUnit(hexOf(1, 5), new units.RomanHeavyInfantry());
        board.addUnit(hexOf(2, 5), new units.RomanHeavyInfantry());
        board.addUnit(hexOf(3, 5), new units.RomanHeavyInfantry());
        board.addUnit(hexOf(4, 5), new units.RomanHeavyInfantry());
        board.addUnit(hexOf(5, 5), new units.RomanHeavyInfantry());        
        board.addUnit(hexOf(2, 3), new units.CarthaginianHeavyInfantry());
        board.addUnit(hexOf(2, 2), new units.CarthaginianHeavyInfantry());
        board.addUnit(hexOf(3, 2), new units.CarthaginianHeavyInfantry());        
    }

    gameStatus(board) {
        let status;
        board.foreachUnit((unit, hex) => {
            if (unit.side === Side.ROMAN && hex.r === 0) {
                status = GameStatus.ROMAN_WIN;
            }
            if (unit.side === Side.CARTHAGINIAN && hex.r === 8) {
                status = GameStatus.CARTHAGINIAN_WIN;
            }
        });
        return status || GameStatus.ONGOING;
    }
}