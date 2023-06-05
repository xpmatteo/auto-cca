
import { Side } from "./side.js";
import * as GameStatus from "./game_status.js";

export class ScenarioRaceToOppositeSide {
    get firstSide() {
        return Side.ROMAN;
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