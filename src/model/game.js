import { Board } from "./board.js";
import { Turn } from "./turn.js";

export class Cca {
    constructor(scenario) {
        this.state = this.getInitialState();
        this.scenario = scenario;
    }

    getInitialState() {
        const board = new Board();
        return {
            board: board,
            turn: new Turn(board),
            currentSide: this.scenario.firstSide,
            gameStatus: GAME_ONGOING
        };
    }

    validCommands(state) {
        return state.turn.generateMoves();
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
        return state.gameStatus !== STATUS_ONGOING;
    }
}
