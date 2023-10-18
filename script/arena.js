import { Side } from "../src/model/side.js";
import { GreedyPlayer } from "../src/ai/greedy_player.js";
import { MctsPlayer } from "../src/ai/mcts_player.js";
import makeGame from "../src/model/game.js";
import { AkragasScenario } from "../src/model/scenarios.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../src/config.js";

const MAX_TURNS = 400;
const NUM_GAMES = 10;
const ITERATIONS = 10000;

const controlPlayer = new MctsPlayer({
    iterations: ITERATIONS,
    expansionFactor: MCTS_EXPANSION_FACTOR,
    logfunction: () => {},
    note: "control",
    playoutIterations: 0,
});
const experimentalPlayer = new MctsPlayer({
    iterations: ITERATIONS,
    expansionFactor: MCTS_EXPANSION_FACTOR,
    logfunction: () => {},
    note: `experimental: 40 playout it's`,
    playoutIterations: 40,
});

function playGame(southPlayer, northPlayer) {
    const timeBefore = Date.now();
    const game = makeGame(new AkragasScenario());
    const sideNorth = game.scenario.sideNorth;
    const sideSouth = game.scenario.sideSouth;

    function unitsKilledOfSide(side) {
        return game.graveyard.unitsOf(side).length;
    }

    let i;
    for (i = 0; i < MAX_TURNS && !game.isTerminal(); i++) {
        const timeSoFar = ((new Date() - timeBefore)/1000).toFixed(0);
        process.stdout.write(`   turn ${i}  ${timeSoFar}s  ${southPlayer} ${(unitsKilledOfSide(sideNorth))} -- ${northPlayer} ${unitsKilledOfSide(sideSouth)}    \r`);
        const player = game.currentSide === sideNorth ? northPlayer : southPlayer;
        const commands = player.decideMove(game);
        for (let command of commands) {
            game.executeCommand(command);
        }
    }
    const timeTaken = ((new Date() - timeBefore)/1000).toFixed(0);
    process.stdout.write(`   turn ${i} ${timeTaken}s  ${southPlayer} ${(unitsKilledOfSide(sideNorth))} -- ${northPlayer} ${unitsKilledOfSide(sideSouth)}    \n`);
    const gameStatus = game.gameStatus;
    if (gameStatus.side === sideNorth) {
        if (northPlayer === experimentalPlayer) {
            experimentalWins++;
        } else {
            controlWins++;
        }
    } else if (gameStatus.side === sideSouth) {
        if (southPlayer === experimentalPlayer) {
            experimentalWins++;
        } else {
            controlWins++;
        }
    } else {
        draws++;
    }
}

export let EXPERIMENTAL_SIDE = undefined;
let experimentalWins = 0;
let controlWins = 0;
let draws = 0;
let cumulativeTime = 0;
for (let i = 0; i < NUM_GAMES/2; i++) {
    const timeBefore = Date.now();
    EXPERIMENTAL_SIDE = Side.SYRACUSAN;
    playGame(experimentalPlayer, controlPlayer);

    EXPERIMENTAL_SIDE = Side.CARTHAGINIAN;
    playGame(controlPlayer, experimentalPlayer);
    cumulativeTime += Date.now() - timeBefore;

    const gamesPlayed = (i + 1) * 2;
    const averageTime = (cumulativeTime / (gamesPlayed*1000)).toFixed(0);
    const percentExperimentalWins = (experimentalWins / (experimentalWins + controlWins + draws) * 100).toFixed(2);
    console.log(`Playout ${gamesPlayed}/${NUM_GAMES}: ${experimentalWins}-${controlWins}-${draws} (${percentExperimentalWins}%) in avg ${averageTime}s/game`);
}
