
import { Side } from "./model/side.js";
import { redraw } from "./view/graphics.js";

const AUTOPLAY_DELAY = 800;

const textBox = document.getElementById("messages");
export function displayEvents(events) {    
    console.log("Events:", events);
    events.forEach(event => {
        textBox.innerHTML += `${event}<br/>`;
        textBox.scrollTop = textBox.scrollHeight;
    });
}

export class Autoplay {
    constructor(game) {
        this.game = game;
    }

    async play(ctx) {
        while (this.game.currentSide === Side.CARTHAGINIAN) {
            let commands = this.game.validCommands();
            if (commands.length === 0) {
                return ;
            }
            let command = commands[Math.floor(Math.random() * commands.length)];
            console.log("Command:", command);
            let events = this.game.executeCommand(command);
            displayEvents(events);
            redraw(ctx, this.game);
            await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
        }
    }
}
