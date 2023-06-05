import { Board } from "./board.js";
import { Turn } from "./turn.js";
import * as GameStatus from "./game_status.js";

export class Cca {
    constructor(scenario) {
        this.scenario = scenario;
        this.state = this.getInitialState();
    }

    getInitialState() {
        const board = new Board();
        this.scenario.placeUnitsOn(board);
        return {
            board: board,
            turn: new Turn(board, this.scenario.firstSide),
            gameStatus: GameStatus.ONGOING,
        };
    }

    validCommands() {
        return this.state.turn.validCommands();
    }

    executeCommand(command) {
        this.state.turn.play(command);
    }

    gameStatus() {
        return this.state.gameStatus;
    }

    isTerminal() {
        return this.state.gameStatus !== GameStatus.ONGOING;
    }

    get currentSide() {
        return this.state.turn.currentSide;
    }
}
