import { GreedyPlayer } from "../src/ai/greedy_player.js";
import { MctsPlayer } from "../src/ai/mcts_player.js";
import makeGame from "../src/model/game.js";
import { AkragasScenario } from "../src/model/scenarios.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../src/config.js";

const MAX_TURNS = 500;

function playout() {
    const timeBefore = Date.now();
    const game = makeGame(new AkragasScenario());
    const sideNorth = game.scenario.sideNorth;
    const sideSouth = game.scenario.sideSouth;
    const northPlayer = new GreedyPlayer(sideNorth);
    const southPlayer = new MctsPlayer({
        iterations: MCTS_ITERATIONS,
        expansionFactor: MCTS_EXPANSION_FACTOR,
        logfunction: () => {
        },
    });

    function unitsKilledOfSide(side) {
        return game.graveyard.unitsOf(side).length;
    }

// const southPlayer = new MinimaxPlayer(8);
    for (let i = 0; i < MAX_TURNS && !game.isTerminal(); i++) {
        process.stdout.write(`Playout: turn ${i};   ${southPlayer} ${(unitsKilledOfSide(sideNorth))} -- ${northPlayer} ${unitsKilledOfSide(sideSouth)}\r`);
        const player = game.currentSide === sideNorth ? northPlayer : southPlayer;
        const commands = player.decideMove(game);
        for (let command of commands) {
            game.executeCommand(command);
        }
    }
    process.stdout.write(`\n`);
    const gameStatus = game.gameStatus;
    const timeTakenInSeconds = ((Date.now() - timeBefore) / 1000).toFixed(0);
    const winner =
        gameStatus.side === sideNorth ? northPlayer.toString() :
        gameStatus.side === sideSouth ? southPlayer.toString() :
            "draw";
    return [winner, gameStatus, timeTakenInSeconds];
}

const result = playout();
console.log("Result: ", result);
