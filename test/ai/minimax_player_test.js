import makeGame from "model/game.js";
import { AkragasScenario, MeleeScenario } from "model/scenarios.js";
import { MinimaxPlayer } from "ai/minimax_player.js";


test('level zero search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(0);
    const tree = player.search(game, 0);

    // expect(tree.score).toBe(9);
    expect(tree.children.length).toBe(0);
    expect(tree.bestCommands()).toEqual([]);
    expect(tree.size()).toBe(1);
});

test('level 1 search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 1);

    // expect(tree.score).toBe(9);
    expect(tree.children.length).toBe(3);
});

test('bestcommands', () => {
    const game = makeGame(new MeleeScenario());
    const player = new MinimaxPlayer(3);
    const best = player.decideMove(game);

    expect(best.length).toBe(3);
});


// test: stop when action is not deterministic
// test: stop when acion changes current side

// level 1: playCard
// level 2: activate units
// level 3: move units
test('search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 3);

    expect(tree.toString()).toMatchSnapshot();
});
