import { chooseBestCommand } from "./autoplay.js";

// Execute a playout till the end of the game, or until a maximum number of iterations is reached
// It will modify the game passed as argument
export function playoutTillTheEndPolicy(game) {
    const maxIterations = 1000;
    let iterations = 0;
    while (!game.isTerminal() && iterations++ < maxIterations) {
        let command = chooseBestCommand(game);
        game.executeCommand(command);
    }
    return game;
}