export class EndPhaseCommand {
    toString() {
        return `End phase`;
    }

    play(game) {
        return game.endPhase();
    }

    value(game) {
        return 0;
    }

    isDeterministic() {
        return true;
    }
}