
const EXPANSION_FACTOR = 1.41421356237;

export function makeRootNode(state, sideExecutingTheMove) {
    return new MonteCarloTreeSearchNode(state, sideExecutingTheMove);
}

class MonteCarloTreeSearchNode {
    #children;

    constructor(state, sideExecutingTheMove, parent = null, move = null) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.#children = [];
        this.wins = 0;
        this.visits = 0;
        this.sideExecutingTheMove = sideExecutingTheMove;
    }

    get children() {
        return this.#children;
    }

    pushChild(state, sideExecutingTheMove, move) {
        this.#children.push(new MonteCarloTreeSearchNode(state, sideExecutingTheMove, this, move));
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
        if (this.#children.length === 0) {
            return 1;
        }
        return 1 + this.#children.map(child => child.size()).reduce((a, b) => a + b, 0);
    }

    depth() {
        // return the depth of the subtree rooted at this node
        if (this.#children.length === 0) {
            return 0;
        }
        return 1 + Math.max(...this.#children.map(child => child.depth()));
    }

    bestChild() {
        let best = this.#children[0];
        for (let child of this.#children) {
            if (child.ubc1() > best.ubc1()) {
                best = child;
            }
        }
        return best;
    }

    score() {
        return this.wins / this.visits;
    }

    mostVisited() {
        let mostVisited = this.#children[0];
        for (let child of this.#children) {
            if (child.score() > mostVisited.score()) {
                mostVisited = child;
            }
        }
        return mostVisited;
    }

    // return the moves on the path of most visited nodes, while validNode returns true or until we reach a leaf node
    mostVisitedPath(validNode) {
        let result = [];
        let currentNode = this;
        while (currentNode.#children.length > 0) {
            currentNode = currentNode.mostVisited();
            if (!validNode(currentNode)) {
                break;
            }
            result.push(currentNode);
        }
        return result.map(node => node.move);
    }

    // return the list of the number of nodes at each level of depth as a list
    shape() {
        const result = [];

        function traverse(node, level) {
            if (!result[level]) {
                result[level] = 0;
            }
            result[level]++;

            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }

        traverse(this, 0);
        return result;
    }
}