import { fixedRandom } from "../src/lib/random.js";
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

Math.random = fixedRandom;


const game = makeGame(new AkragasScenario());
const timeBefore = Date.now();
player.decideMove(game);
const timeTaken = Date.now() - timeBefore;
console.log(`Time taken: ${(timeTaken/1000).toFixed(2)}s`)
