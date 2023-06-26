import { chooseBestCommand, chooseRandomCommand } from "./autoplay.js";

// Execute a playout till the end of the game, or until a maximum number of iterations is reached
// It will modify the game passed as argument
// It returns the game status at end of the playout
export function playoutTillTheEndPolicy(game) {
    const maxIterations = 1000;
    let iterations = 0;
    while (!game.isTerminal() && iterations++ < maxIterations) {
        let command = chooseBestCommand(game);
        game.executeCommand(command);
    }
    return game.gameStatus;
}


export function fastPlayoutPolicy(game) {
    const maxIterations = 1000;
    let iterations = 0;

    let side = game.currentSide;
    while (!game.isTerminal() && side === game.currentSide) {
        if (iterations++ > maxIterations) {
            throw new Error("Too many iterations: " + iterations);
        }
        let command = chooseBestCommand(game);
        game.executeCommand(command);
    }
}