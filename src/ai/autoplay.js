import { Side } from "../model/side.js";
import { redraw } from "../view/graphics.js";
import AIPlayer, { performanceObserver, treeObserver, winLossObserver } from "./ai_player.js";
import { fastPlayoutPolicy } from "./playout_policies.js";

const AUTOPLAY_DELAY = 800;
const AI_ITERATIONS = 40000;

const textBox = document.getElementById("messages");
export function displayEvents(events) {
    events.forEach(event => {
        textBox.innerHTML += `${event}<br/>`;
        textBox.scrollTop = textBox.scrollHeight;
    });
}

export function chooseRandomCommand(game) {
    let commands = game.validCommands();
    if (commands.length === 0) {
        throw new Error("No valid commands");
    }
    return commands[Math.floor(Math.random() * commands.length)];
}

export function chooseBestCommand(game) {
    let commands = game.validCommands();
    if (commands.length === 0) {
        throw new Error("No valid commands");
    }

    // sort commands by value
    commands.sort((a, b) => b.value(game) - a.value(game));

    // extract all the commands with the highest value
    let bestCommands = commands.filter(command => command.value(game) === commands[0].value(game));

    // choose randomly from the best commands
    return bestCommands[Math.floor(Math.random() * bestCommands.length)];
}


export class Autoplay {
    constructor(game) {
        this.game = game;
        this.aiPlayer = new AIPlayer({
            game: game,
            iterations: AI_ITERATIONS,
            aiSide: Side.CARTHAGINIAN,
            observers: [
                performanceObserver,
                treeObserver,
                winLossObserver,
            ],
            playoutPolicy: fastPlayoutPolicy,
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
        if (this.game.currentSide === Side.CARTHAGINIAN && !this.game.isTerminal()) {
            const commands = this.aiPlayer.decideMove(this.game);
            for (let command of commands) {
                console.log("Executing command: " + command);
                let events = this.game.executeCommand(command);
                displayEvents(events);
                redraw(graphics, this.game);
                await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
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

    executeBestCommand() {
        let command = chooseBestCommand(this.game);

        return this.game.executeCommand(command);
    }
}
