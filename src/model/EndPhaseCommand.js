
export class EndPhaseCommand {
    play(turn) {
        turn.endPhase();
    }

    toString() {
        return "End of turn";
    }
}
