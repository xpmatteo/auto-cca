
import {assertEquals, assertTrue, assertDeepEquals, test, assertAlmostEquals} from "../lib/test_lib.js";
import { MonteCarloTreeSearchNode } from './monte_carlo_tree_search_node.js';
import {Side} from "../model/side.js";

// unit tests for the MonteCarloTreeSearchNode class

// create node
test('create root node', () => {
    let node = new MonteCarloTreeSearchNode({}, Side.ROMAN);
    assertDeepEquals({}, node.state);
    assertEquals(Side.ROMAN, node.sideExecutingTheMove);
    assertEquals(null, node.move);
    assertEquals(null, node.parent);
    assertEquals(0, node.wins);
    assertEquals(0, node.visits);
    assertEquals(0, node.children.length);
});

// ubc1
test('ubc1', () => {
    let node = new MonteCarloTreeSearchNode({}, Side.ROMAN);
    node.wins = 1;
    node.visits = 2;
    node.parent = {
        visits: 3
    };
    assertAlmostEquals(1 / 2 + Math.sqrt(2 * Math.log(3) / 2), node.ubc1());
});

// update
test('update', () => {
    let node = new MonteCarloTreeSearchNode({}, Side.ROMAN);
    node.update(1, false);
    assertEquals(1, node.wins);
    assertEquals(1, node.visits);

    node.update(1, true);
    assertEquals(0, node.wins);
    assertEquals(2, node.visits);
});

// size
test('size', () => {
    let root = new MonteCarloTreeSearchNode({}, Side.ROMAN);
    assertEquals(1, root.size());

    root.children.push(new MonteCarloTreeSearchNode({}, Side.CARTHAGINIAN));
    assertEquals(2, root.size());

    root.children.push(new MonteCarloTreeSearchNode({}, Side.CARTHAGINIAN));
    assertEquals(3, root.size());
});

