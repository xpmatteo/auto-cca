import { RetreatCommand } from "../commands/commands.js";
import { Phase } from "./Phase.js";


export class RetreatPhase extends Phase {
    constructor(temporarySide, fromHex, toHexes) {
        super("retreat");
        this.fromHex = fromHex;
        this.toHexes = toHexes;
        this.temporarySide = temporarySide;
    }

    validCommands(turn, board) {
        return this.toHexes.map(toHex => new RetreatCommand(toHex, this.fromHex));
    }
}
