
import { Side } from "./model/side.js";
import { redraw } from "./view/graphics.js";

const AUTOPLAY_DELAY = 800;

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
            this.game.executeCommand(command);
            redraw(ctx, this.game);
            await new Promise(resolve => setTimeout(resolve, AUTOPLAY_DELAY));
        }
    }
}
