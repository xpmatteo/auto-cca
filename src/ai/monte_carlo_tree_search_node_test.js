
import {assertEquals, assertTrue, assertDeepEquals, test, assertAlmostEquals} from "../lib/test_lib.js";
import { makeRootNode } from './monte_carlo_tree_search_node.js';
import {Side} from "../model/side.js";

// unit tests for the MonteCarloTreeSearchNode class

// create node
test('create root node', () => {
    let node = makeRootNode({}, Side.ROMAN);
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
    let node = makeRootNode({}, Side.ROMAN);
    node.wins = 1;
    node.visits = 2;
    node.parent = {
        visits: 3
    };
    assertAlmostEquals(1 / 2 + Math.sqrt(2 * Math.log(3) / 2), node.ubc1());
});

// update
test('update', () => {
    let node = makeRootNode({}, Side.ROMAN);
    node.update(1, false);
    assertEquals(1, node.wins);
    assertEquals(1, node.visits);

    node.update(1, true);
    assertEquals(0, node.wins);
    assertEquals(2, node.visits);
});

test('size', () => {
    let root = makeRootNode({}, Side.ROMAN);
    assertEquals(1, root.size());

    root.pushChild();
    assertEquals(2, root.size());

    root.pushChild();
    assertEquals(3, root.size());
});

test('depth', () => {
    let root = makeRootNode({}, Side.ROMAN);
    assertEquals(0, root.depth());

    root.pushChild({}, Side.ROMAN, 1);
    root.pushChild({}, Side.ROMAN, 2);
    let child2 = root.children[1];
    child2.pushChild({}, Side.CARTHAGINIAN, 3);

    assertEquals(1, child2.depth());
    assertEquals(2, root.depth());
});

test('shape', () => {
    let root = makeRootNode({}, Side.ROMAN);
    root.pushChild({}, Side.ROMAN, 1);
    root.pushChild({}, Side.ROMAN, 2);
    let child2 = root.children[1];
    child2.pushChild({}, Side.CARTHAGINIAN, 3);
    child2.pushChild({}, Side.CARTHAGINIAN, 4);
    child2.pushChild({}, Side.CARTHAGINIAN, 5);

    assertDeepEquals([1,2,3], root.shape());
});


test('return the path of most visited nodes', () => {
    let root = makeRootNode({}, Side.ROMAN);
    root.pushChild({}, Side.ROMAN, 1);
    root.children[0].visits = 100;
    root.pushChild({}, Side.ROMAN, 2);
    root.children[1].visits = 200;
    let child2 = root.children[1];
    child2.pushChild({}, Side.CARTHAGINIAN, 3);
    child2.children[0].visits = 300;

    let pathUntilLeaf = root.mostVisitedPath(() => { return true; });
    assertDeepEquals([2, 3], pathUntilLeaf, "path until leaf node");

    let pathUntilInvalid = root.mostVisitedPath((node) => { return node.sideExecutingTheMove === Side.ROMAN; });
    assertDeepEquals([2], pathUntilInvalid, "path until invalid node");
});