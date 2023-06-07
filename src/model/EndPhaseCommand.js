
export class EndPhaseCommand {
    play(turn) {
        turn.switchSide();
    }

    toString() {
        return "End of turn";
    }
}
