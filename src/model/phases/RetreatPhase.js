import { Phase } from "./Phase.js";
import {RetreatCommand} from "../commands/retreatCommand.js";


export class RetreatPhase extends Phase {
    constructor(temporarySide, fromHex, toHexes) {
        super("retreat");
        this.fromHex = fromHex;
        this.toHexes = toHexes;
        this.temporarySide = temporarySide;
    }

    validCommands(game) {
        return this.toHexes.map(toHex => new RetreatCommand(toHex, this.fromHex));
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }
}
