import getParameterByName from "./lib/query_string.js";
import { drawTree } from "./view/draw_tree.js";
import makeGame from "./model/game.js";
import { MctsPlayer } from "./ai/mcts_player.js";
import { scoreMcts } from "./ai/score.js";
import getQueryParameter from "./lib/query_string.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "./config.js";
import { makeScenario } from "./model/scenarios.js";

const scenario = makeScenario(getQueryParameter("scenario"));
const game = makeGame(scenario);
drawTree(game, getParameterByName("depth") || 1000);


