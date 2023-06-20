
const EXPANSION_FACTOR = 1.41421356237;

export class MonteCarloTreeSearchNode {
    constructor(state, sideExecutingTheMove, parent = null, move = null) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.children = [];
        this.wins = 0;
        this.visits = 0;
        this.sideExecutingTheMove = sideExecutingTheMove;
    }

    ubc1() {
        if (this.visits === 0) {
            return Infinity;
        }
        return this.wins / this.visits + EXPANSION_FACTOR * Math.sqrt(Math.log(this.parent.visits) / this.visits);
    }

    update(score, isOpponentTurn) {
        if (isOpponentTurn) {
            score = -1 * score;
        }
        this.wins += score;
        this.visits++;
    }

    size() {
        // return the number of nodes in the subtree rooted at this node
        if (this.children.length === 0) {
            return 1;
        }
        return 1 + this.children.map(child => child.size()).reduce((a, b) => a + b, 0);
    }

    bestChild() {
        let best = this.children[0];
        for (let child of this.children) {
            if (child.ubc1() > best.ubc1()) {
                best = child;
            }
        }
        return best;
    }

    mostVisited() {
        let mostVisited = this.children[0];
        for (let child of this.children) {
            if (child.visits > mostVisited.visits) {
                mostVisited = child;
            }
        }
        return mostVisited;
    }

    // return the moves on the path of most visited nodes, while validNode returns true or until we reach a leaf node
    mostVisitedPath(validNode) {
        let result = [];
        let currentNode = this;
        while (currentNode.children.length > 0) {
            currentNode = currentNode.mostVisited();
            if (!validNode(currentNode)) {
                break;
            }
            result.push(currentNode);
        }
        return result.map(node => node.move);
    }
}