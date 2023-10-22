import { Command } from "./commands.js";

export class MacroMoveCommand extends Command {
    constructor(commands) {
        super();
        this.commands = commands;
    }

    play(game) {
        this.commands.forEach(command => command.play(game));
        game.endPhase();
        return [];
    }

    toString() {
        return "Macro: " + this.commands.map(command => command.toString()).join("\n");
    }
}
