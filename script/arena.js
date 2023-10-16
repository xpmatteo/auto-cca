import { randomElement } from "../src/lib/random.js";
import { GreedyPlayer } from "../src/ai/greedy_player.js";
import { MctsPlayer } from "../src/ai/mcts_player.js";
import makeGame from "../src/model/game.js";
import { AkragasScenario } from "../src/model/scenarios.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../src/config.js";

const MAX_TURNS = 500;
const NUM_PLAYOUTS = 100;

function playout() {
    const timeBefore = Date.now();
    const game = makeGame(new AkragasScenario());
    const sideNorth = game.scenario.sideNorth;
    const sideSouth = game.scenario.sideSouth;
    const northPlayer = new MctsPlayer({
        iterations: MCTS_ITERATIONS,
        expansionFactor: MCTS_EXPANSION_FACTOR,
        logfunction: () => {},
    });
    const southPlayer = new MctsPlayer({
        iterations: MCTS_ITERATIONS,
        expansionFactor: MCTS_EXPANSION_FACTOR,
        logfunction: () => {},
    });

    function unitsKilledOfSide(side) {
        return game.graveyard.unitsOf(side).length;
    }

// const southPlayer = new MinimaxPlayer(8);
    for (let i = 0; i < MAX_TURNS && !game.isTerminal(); i++) {
        process.stdout.write(`   turn ${i};   ${southPlayer} ${(unitsKilledOfSide(sideNorth))} -- ${northPlayer} ${unitsKilledOfSide(sideSouth)}\r`);
        const player = game.currentSide === sideNorth ? northPlayer : southPlayer;
        const commands = player.decideMove(game);
        for (let command of commands) {
            game.executeCommand(command);
        }
    }
    process.stdout.write(`\n`);
    const gameStatus = game.gameStatus;
    const timeTakenInSeconds = ((Date.now() - timeBefore) / 1000);
    const winner =
        gameStatus.side === sideSouth ?  1 :
        gameStatus.side === sideNorth ? -1 :
        0;
    return [winner, gameStatus, timeTakenInSeconds];
}

let northWins = 0;
let southWins = 0;
let draws = 0;
let cumulativeTime = 0;
for (let i = 0; i < NUM_PLAYOUTS; i++) {
    const result = playout();
    if (result[0] === 1) {
        southWins++;
    } else if (result[0] === -1) {
        northWins++;
    } else {
        draws++;
    }
    cumulativeTime += result[2];
    const averageTime = (cumulativeTime / (i + 1)).toFixed(0);
    console.log(`Playout ${i+1}/${NUM_PLAYOUTS}: ${southWins}-${northWins}-${draws} in average ${averageTime} seconds`);
}
