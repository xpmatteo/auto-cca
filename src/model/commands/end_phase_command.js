export class EndPhaseCommand {
    toString() {
        return `End phase`;
    }

    play(game) {
        return game.endPhase();
    }

    isDeterministic() {
        return true;
    }
}
