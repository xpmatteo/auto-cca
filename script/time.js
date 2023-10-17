import { MctsPlayer } from "../src/ai/mcts_player.js";
import makeGame from "../src/model/game.js";
import { AkragasScenario } from "../src/model/scenarios.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../src/config.js";

const MAX_TURNS = 400;
const NUM_GAMES = 10;
const ITERATIONS = 50000;

const player = new MctsPlayer({
    iterations: ITERATIONS,
    expansionFactor: MCTS_EXPANSION_FACTOR,
});

const RANDOM_VALUES = [0.1, 0.3, 0.2, 0.7, 0.9, 0.6, 0.4, 0.8];
let nextRandom = 0;
Math.random = () => RANDOM_VALUES[nextRandom++ % 8];


const game = makeGame(new AkragasScenario());
const timeBefore = Date.now();
player.decideMove(game);
const timeTaken = Date.now() - timeBefore;
console.log(`Time taken: ${(timeTaken/1000).toFixed(2)}s`)
