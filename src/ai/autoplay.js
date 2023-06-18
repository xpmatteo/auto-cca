
import { Side } from "../model/side.js";
import { redraw, drawTextOnHex } from "../view/graphics.js";
import AIPlayer from "./mcts_ai.js";
import * as GameStatus from "../model/game_status.js";

const AUTOPLAY_DELAY = 800;

const textBox = document.getElementById("messages");
export function displayEvents(events) {
    events.forEach(event => {
        textBox.innerHTML += `${event}<br/>`;
        textBox.scrollTop = textBox.scrollHeight;
    });
}

export class Autoplay {
    constructor(game) {
        this.game = game;
        this.aiPlayer = new AIPlayer({
            game: game,
            iterations: 1000,
            aiWinStatuses: [GameStatus.CARTHAGINIAN_WIN],
            aiLoseStatuses: [GameStatus.ROMAN_WIN],
            aiToken: Side.CARTHAGINIAN,
        });
    }

    randomPlayout() {
        while (!this.game.isTerminal()) {
            this.executeRandomCommand();
        }
    }

    async playout(graphics) {
        while (!this.game.isTerminal()) {
            let events = await this.executeBestCommand();
            displayEvents(events);
            redraw(graphics, this.game);
            await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
        }
    }

    async play(graphics) {
        while (this.game.currentSide === Side.CARTHAGINIAN) {
            const command = this.aiPlayer.decideMove(this.game);
            let events = this.game.executeCommand(command);
            displayEvents(events);
            redraw(graphics, this.game);
            await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
        }
    }

    executeRandomCommand() {
        let commands = this.game.validCommands();
        if (commands.length === 0) {
            throw new Error("No valid commands");
        }
        let command = commands[Math.floor(Math.random() * commands.length)];
        return this.game.executeCommand(command);
    }

    executeBestCommand() {
        let commands = this.game.validCommands();
        if (commands.length === 0) {
            throw new Error("No valid commands");
        }

        // sort commands by value
        commands.sort((a, b) => b.value(this.game) - a.value(this.game));

        // extract all the commands with the highest value
        let bestCommands = commands.filter(command => command.value(this.game) === commands[0].value(this.game));

        // choose randomly from the best commands
        let command = bestCommands[Math.floor(Math.random() * bestCommands.length)];

        return this.game.executeCommand(command);
    }
}