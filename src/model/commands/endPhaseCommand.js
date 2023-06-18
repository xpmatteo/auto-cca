export class EndPhaseCommand {
    toString() {
        return `End phase`;
    }

    play(game) {
        game.endPhase();
        return [];
    }

    value(game) {
        return 0;
    }
}