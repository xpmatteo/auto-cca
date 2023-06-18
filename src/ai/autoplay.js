
import { Side } from "../model/side.js";
import { redraw, drawTextOnHex } from "../view/graphics.js";

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
    }

    showAiWeights() {
        if (this.game.currentSide !== Side.CARTHAGINIAN) {
            return;
        }
        let commands = this.game.validCommands();
        commands.sort((a, b) => b.value(this.game) - a.value(this.game));
        console.log("-----------------");
        commands.forEach(command => {
            console.log(`${command} value: ${command.value(this.game)}`);
        });    
    }

    fastPlayout(graphics) {
        while (!this.game.isTerminal()) {
            this.executeBestCommand();
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
        if (this.game.currentSide === Side.CARTHAGINIAN) {            
            let events = this.executeBestCommand();
            displayEvents(events);
            redraw(graphics, this.game);
            await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
        }
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
