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
            turn: new Turn(board),
            currentSide: this.scenario.firstSide,
            gameStatus: GameStatus.ONGOING,
        };
    }

    validCommands(state) {
        return state.turn.validCommands();
    }

    executeCommand(state, move) {
        state.turn.executeCommand(move);
        state.currentSide = this.turn.currentSide;
        state.gameStatus = this.scenario.gameStatus(this.board);
    }

    gameStatus(state) {
        return state.gameStatus;
    }

    isTerminal(state) {
        return state.gameStatus !== GameStatus.ONGOING;
    }
}
