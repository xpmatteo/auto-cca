import { Board } from "./board.js";
import { Turn } from "./turn.js";
import * as GameStatus from "./game_status.js";

export class Cca {
    constructor(scenario, board, turn) {
        this.scenario = scenario;
        this.board = board;
        this.turn = turn;
    }

    initialize() {
        this.board = new Board();
        this.turn = new Turn(this.board, this.scenario.firstSide);
        this.scenario.placeUnitsOn(this.board);
    }

    validCommands() {
        if (this.isTerminal()) return [];
        return this.turn.validCommands();
    }

    executeCommand(command) {
        if (this.isTerminal()) 
            throw new Error("Cannot execute commands: game is over");
        this.turn.play(command);
    }

    get gameStatus() {
        return this.scenario.gameStatus(this.board);
    }

    isTerminal() {
        return this.gameStatus !== GameStatus.ONGOING;
    }

    get currentSide() {
        return this.turn.currentSide;
    }        
}
