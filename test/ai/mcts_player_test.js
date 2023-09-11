import makeGame from "model/game.js";
import { AkragasScenario } from "model/scenarios.js";
import { MctsPlayer, TreeNode } from "ai/mcts_player.js";
import { Side } from "model/side.js";


test('MCTS one search expands the initial node', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MctsPlayer({
        iterations: 1,
    });
    const tree = player.search(game);

    expect(tree.children.length).toBe(3);
    expect(tree.size()).toBe(4);
    expect(tree.visits).toBe(3);
    expect(tree.score).toBe(27);
});

function treeNodeWith(side, command, children) {
    let tree = new TreeNode({currentSide: side});
    tree.command = command;
    tree.children = children;
    return tree;
}

test("only return the current side's commands", () => {
    expect(treeNodeWith(Side.ROMAN, undefined, []).bestCommands()).toEqual([]);
    expect(treeNodeWith(Side.ROMAN, "c1", []).bestCommands()).toEqual(["c1"]);

    expect(treeNodeWith(Side.ROMAN, "c1", [
        treeNodeWith(Side.ROMAN, "c2", []),
    ]).bestCommands()).toEqual(["c1", "c2"]);

    expect(treeNodeWith(Side.ROMAN, undefined, [
        treeNodeWith(Side.ROMAN, "c2", []),
    ]).bestCommands()).toEqual(["c2"]);

    expect(treeNodeWith(Side.ROMAN, undefined, [
        treeNodeWith(Side.ROMAN, "c2", [
            treeNodeWith(Side.ROMAN, "c3", []),
        ]),
    ]).bestCommands()).toEqual(["c2", "c3"]);

    const treeSwitchingSides = treeNodeWith(Side.ROMAN, undefined, [
        treeNodeWith(Side.ROMAN, "c2", [
            treeNodeWith(Side.CARTHAGINIAN, "c3", []),
        ]),
    ]);
    expect(treeSwitchingSides.bestCommands()).toEqual(["c2", "c3"]);
    expect(treeSwitchingSides.bestCommands(Side.ROMAN)).toEqual(["c2"]);
});

function show(bestCommands) {
    return bestCommands.map(c => c.toString());
}

test('MCTS one search expands the initial node', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MctsPlayer({
        iterations: 10000,
        expansionFactor: 1000,
    });
    const tree = player.search(game);

    console.log(tree.shape());
    console.dir(show(tree.bestCommands()));
    console.log(tree.toString(2));

    // expect(tree.children.length).toBe(3);
    // expect(tree.size()).toBe(4);
    // expect(tree.visits).toBe(1);
    // expect(tree.score).toBe(11);
});

// TODO

// add losses to score
// deal with non-deterministic moves

// endphase not available until all units are moved or decided to stay
// avoid looping moves

// DONE deal with change of side
// DONE score all available moves at expansion time
// DONE endphase not available until all units are ordered
