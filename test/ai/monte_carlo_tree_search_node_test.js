import { EXPANSION_FACTOR, makeRootNode } from 'ai/monte_carlo_tree_search_node.js';
import { Side } from "model/side.js";

// unit tests for the MonteCarloTreeSearchNode class

// create node
test('create root node', () => {
    let node = makeRootNode({}, Side.ROMAN);
    expect(node.state).toEqual({});
    expect(node.sideExecutingTheMove).toEqual(Side.ROMAN);
    expect(node.move).toEqual(null);
    expect(node.parent).toEqual(null);
    expect(node.wins).toEqual(0);
    expect(node.visits).toEqual(0);
    expect(node.children.length).toEqual(0);
});

// ubc1
test('ubc1', () => {
    let node = makeRootNode({}, Side.ROMAN);
    node.wins = 1;
    node.visits = 2;
    node.parent = {
        visits: 3
    };
    expect(node.ubc1()).toBeCloseTo(1 / 2 + EXPANSION_FACTOR * Math.sqrt(Math.log(3) / 2), 0.0000001);
});

// update
test('update', () => {
    let node = makeRootNode({}, Side.ROMAN);
    node.update(1, false);
    expect(node.wins).toEqual(1);
    expect(node.visits).toEqual(1);

    node.update(1, true);
    expect(node.wins).toEqual(0);
    expect(node.visits).toEqual(2);
});

test('size', () => {
    let root = makeRootNode({}, Side.ROMAN);
    expect(root.size()).toEqual(1);

    root.pushChild();
    expect(root.size()).toEqual(2);

    root.pushChild();
    expect(root.size()).toEqual(3);
});

test('depth', () => {
    let root = makeRootNode({}, Side.ROMAN);
    expect(root.depth()).toEqual(0);

    root.pushChild({}, Side.ROMAN, 1);
    root.pushChild({}, Side.ROMAN, 2);
    let child2 = root.children[1];
    child2.pushChild({}, Side.CARTHAGINIAN, 3);

    expect(child2.depth()).toEqual(1);
    expect(root.depth()).toEqual(2);
});

test('shape', () => {
    let root = makeRootNode({}, Side.ROMAN);
    root.pushChild({}, Side.ROMAN, 1);
    root.pushChild({}, Side.ROMAN, 2);
    let child2 = root.children[1];
    child2.pushChild({}, Side.CARTHAGINIAN, 3);
    child2.pushChild({}, Side.CARTHAGINIAN, 4);
    child2.pushChild({}, Side.CARTHAGINIAN, 5);

    expect(root.shape()).toEqual([1, 2, 3]);
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

    let pathUntilLeaf = root.mostVisitedPathMoves(() => { return true; });
    expect(pathUntilLeaf).toEqual([2, 3]);

    let pathUntilInvalid = root.mostVisitedPathMoves((node) => { return node.sideExecutingTheMove === Side.ROMAN; });
    expect(pathUntilInvalid).toEqual([2]);
});
