
import { assertEquals, assertTrue, assertDeepEquals, test } from "../lib/test_lib.js";
import { MonteCarloTreeSearchNode } from './monte_carlo_tree_search_node.js';
import {Side} from "../model/side.js";


// write unit tests for the MonteCarloTreeSearchNode class

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