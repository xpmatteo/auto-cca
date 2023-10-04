import { Side } from "../model/side.js";
import { redraw } from "../view/graphics.js";

const AUTOPLAY_DELAY = 800;
const AI_ITERATIONS = 1000;

export function displayEvents(events) {
    const textBox = document.getElementById("messages");
    events.forEach(event => {
        textBox.innerHTML += `${event}<br/>`;
        textBox.scrollTop = textBox.scrollHeight;
    });
}

function chooseRandomCommand(game) {
    let commands = game.validCommands();
    if (commands.length === 0) {
        throw new Error("No valid commands");
    }
    return commands[Math.floor(Math.random() * commands.length)];
}

export class RandomPlayer {
    decideMove(game) {
        return [chooseRandomCommand(game)];
    }
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
        while (!this.game.isTerminal()) {
            let events = await this.executeRandomCommand();
            displayEvents(events);
            redraw(graphics, this.game);
            await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
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
                try {
                    console.log("Executing command: " + command);
                    let events = this.game.executeCommand(command);
                    displayEvents(events);
                    redraw(graphics, this.game);
                    await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
                } catch (error) {
                    console.log(" ****** Error executing command: " + error);
                }
            }
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
}
