import { Command } from "./commands.js";

export class MacroCommand extends Command {
    /**
     * @param {Command[]} commands
     */
    constructor(commands) {
        super();
        this.commands = commands;
    }

    toString() {
        return `MacroCommand(${this.commands})`;
    }

    play(game) {
        const events = [];
        for (const command of this.commands) {
            events.push(...command.play(game));
        }
        game.endPhase();
        return events;
    }

}

