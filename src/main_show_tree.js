import getParameterByName from "./lib/query_string.js";
import getQueryParameter from "./lib/query_string.js";
import makeGame from "./model/game.js";
import { makeScenario } from "./model/scenarios.js";
import { drawTree } from "./view/draw_tree.js";

const scenario = makeScenario(getQueryParameter("scenario"));
const game = makeGame(scenario);
drawTree(game, getParameterByName("depth") || 1000);


