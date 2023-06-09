
export class EndPhaseCommand {
    play(turn) {
        turn.endPhase();
        return [];
    }

    toString() {
        return "End of turn";
    }
}
