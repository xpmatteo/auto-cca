import getParameterByName from "./lib/query_string.js";
import getQueryParameter from "./lib/query_string.js";
import makeGame from "./model/game.js";
import { makeScenario } from "./model/scenarios.js";
import { drawTree } from "./view/draw_tree.js";

const scenario = makeScenario(getQueryParameter("scenario"));
const game = makeGame(scenario);
const iterations = getParameterByName("iterations") || 1000;
const playoutIterations = getParameterByName("playouts") || 0;
const depth = getParameterByName("depth") || 4
const threshold = getParameterByName("threshold") || 0
const prune = getParameterByName("prune") || 0
drawTree(game, iterations, playoutIterations, depth, threshold, prune);


