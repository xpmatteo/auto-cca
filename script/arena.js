import { GreedyPlayer } from "../src/ai/greedy_player.js";
import { MctsPlayer } from "../src/ai/mcts_player.js";
import makeGame from "../src/model/game.js";
import { AkragasScenario } from "../src/model/scenarios.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../src/config.js";

const MAX_TURNS = 1000;

function playout() {
    const game = makeGame(new AkragasScenario());
    const sideNorth = game.scenario.sideNorth;
    const sideSouth = game.scenario.sideSouth;
    const northPlayer = new GreedyPlayer(sideNorth);
    const southPlayer = new MctsPlayer({iterations: MCTS_ITERATIONS, expansionFactor: MCTS_EXPANSION_FACTOR});
// const southPlayer = new MinimaxPlayer(8);
    for (let i = 0; i < MAX_TURNS && !game.isTerminal(); i++) {
        if (i % 100 === 0) {
            process.stdout.write(`Playout: turn ${i}\r`);
        }
        const player = game.currentSide === sideNorth ? northPlayer : southPlayer;
        const commands = player.decideMove(game);
        for (let command of commands) {
            game.executeCommand(command);
        }
    }
    return game.gameStatus;
}

const result = playout();
console.log("Result: ", result);
