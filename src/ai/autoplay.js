import { MCTS_ITERATIONS } from "../config.js";
import { Side } from "../model/side.js";
import { redraw } from "../view/graphics.js";
import { GreedyPlayer } from "./greedy_player.js";
import { MctsPlayer } from "./mcts_player.js";

export function displayEvents(events) {
    const textBox = document.getElementById("messages");
    events.forEach(event => {
        textBox.innerHTML += `${event}<br/>`;
        textBox.scrollTop = textBox.scrollHeight;
    });
}

export class RandomPlayer {
    decideMove(game) {
        let commands = game.validCommands();
        if (commands.length === 0) {
            throw new Error("No valid commands");
        }
        const chosen = commands[Math.floor(Math.random() * commands.length)];
        return [chosen];
    }
}

function paused() {
    return document.getElementById("pause").checked;
}

function delay() {
    return new Number(document.getElementById("delay").value);
}

export class Autoplay {
    constructor(game, aiPlayer) {
        this.game = game;
        this.aiPlayer = aiPlayer;
    }

    randomPlayout() {
        while (!this.game.isTerminal()) {
            this.executeRandomCommand();
        }
    }

    async playout(graphics) {
        const game = this.game.toGame();
        const sideNorth = game.scenario.sideNorth;
        const sideSouth = game.scenario.sideSouth;
        const northPlayer = new GreedyPlayer(sideNorth);
        const southPlayer = new MctsPlayer({iterations: MCTS_ITERATIONS, exoaansionFactor: MCTS_ITERATIONS});
        // const southPlayer = new MinimaxPlayer(8);
        while (!this.game.isTerminal() && !paused()) {
            const player = this.game.currentSide === sideNorth ? northPlayer : southPlayer;
            const commands = player.decideMove(game);
            for (let command of commands) {
                await this.doExecuteCommand(command, graphics);
            }
        }
    }

    async play(graphics) {
        while (this.game.currentSide === Side.CARTHAGINIAN && !this.game.isTerminal()) {
            const commands = this.aiPlayer.decideMove(this.game);
            if (commands.length === 0) {
                console.log("????? AI returned no commands");
                return;
            }
            for (let command of commands) {
                await this.doExecuteCommand(command, graphics);
            }
        }
    }

    async doExecuteCommand(command, graphics) {
        try {
            console.log("Executing command: " + command);
            const events = this.game.executeCommand(command);
            displayEvents(events);
            redraw(graphics, this.game);
            await new Promise(resolve => setTimeout(resolve, delay()));
        } catch (error) {
            console.log(" ****** Error executing command: " + error);
        }
    }
}
