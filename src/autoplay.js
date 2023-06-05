
export class Autoplay {
    constructor(game) {
        this.game = game;
    }

    play() {
        let commands = this.game.generateCommands();
        if (commands.length === 0) {
            return ;
        }
        let command = commands[Math.floor(Math.random() * commands.length)];
        this.game.play(command);
    }
}