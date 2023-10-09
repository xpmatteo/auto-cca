import { MctsPlayer, TreeNode } from "ai/mcts_player.js";
import { OrderHeavyTroopsCard } from "model/cards.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";


test('MCTS one search expands the initial node', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    const player = new MctsPlayer({
        iterations: 1,
    });
    const tree = player.search(game);

    expect(tree.children.length).toBe(1);
    expect(tree.children[0].score).toBe(0);
    expect(tree.score).toBe(0);
    expect(tree.visits).toBe(1);
});

it('expands one node', () => {
    const player = new MctsPlayer();
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    game.handSouth = [new OrderHeavyTroopsCard()];
    game.executeCommand(game.validCommands()[0]); // play order heavy troops card
    game.executeCommand(game.validCommands()[0]); // end phase
    const root = new TreeNode(game);

    player.iterate(root);
    console.log(root.toString(4));

    expect(root.describeNode()).toBe("0/3: undefined -> Roman movement -> 3");
    expect(root.children[0].describeNode()).toBe("0/1: Move [0,0] to [1,0] -> Roman movement -> 0");
    expect(root.children[1].describeNode()).toBe("0/1: Move [0,0] to [0,1] -> Roman movement -> 0");
    expect(root.children[2].describeNode()).toBe("0/1: End phase -> Roman battle -> 0");
});
