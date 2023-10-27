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

    hasFromHex(hex) {
        return this.commands.some((command) => command.fromHex === hex);
    }

    hasToHex(hex) {
        return this.commands.some((command) => command.toHex === hex);
    }

    indexOfFromHex(hex) {
        return this.commands.findIndex((command) => command.fromHex === hex);
    }
}

