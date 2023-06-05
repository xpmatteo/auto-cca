
import { Side } from "./model/side.js";

export class Autoplay {
    constructor(game) {
        this.game = game;
    }

    play() {
        while (this.game.currentSide === Side.CARTHAGINIAN) {
            let commands = this.game.validCommands();
            if (commands.length === 0) {
                return ;
            }
            let command = commands[Math.floor(Math.random() * commands.length)];
            this.game.executeCommand(command);
        }
    }
}