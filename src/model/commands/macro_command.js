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
        let deterministic = true;
        for (let i = 0; i < this.commands.length && deterministic; i++) {
            const command = this.commands[i];
            events.push(...command.play(game));
            deterministic = command.isDeterministic();
        }
        if (deterministic) {
            game.endPhase();
        }
        return events;
    }

}

