import { Command } from "model/commands/commands.js";

export class MacroMoveCommand extends Command {
    constructor(commands) {
        super();
        this.commands = commands;
    }

    execute(game) {
        this.commands.forEach(command => command.execute(game));
    }

    toString() {
        return "Macro: " + this.commands.map(command => command.toString()).join("\n");
    }
}
