import { makeRootNode } from "./monte_carlo_tree_search_node.js";
import { playoutTillTheEndPolicy } from "./playout_policies.js";

export const performanceObserver = {
    onStartDecideMove: function (aiPlayer) {
        console.log("-------- AI is thinking... ---------");
        this.startTime = performance.now();
    },
    onEndDecideMove: function (aiPlayer, root) {
        const end = performance.now();
        const start = this.startTime;
        const timeInSeconds = ((end - start) / 1000).toFixed(2);
        const timePerIteration = (end - start) / aiPlayer.iterations;
        console.log(`AI took ${timeInSeconds} seconds to decide; ${timePerIteration.toFixed(2)} ms per iteration`);
    },
}

export const treeObserver = {
    onStartDecideMove: function (aiPlayer) {
        this.treeSize = 0;
    },
    onEndDecideMove: function (aiPlayer, root) {
        console.log(`tree size: ${root.size()}, shape: ${root.shape()}`);
        root.children.sort((a, b) => b.visits - a.visits);
        for (let child of root.children) {
            console.log(`Child move: ${child.move}, score: ${child.wins}/${child.visits}`);
        }
        console.log("---");
        console.log(root.mostVisitedPath1().map(node => `${node.sideExecutingTheMove}\t${node.move} (${node.wins}/${node.visits})`).join("\n"));
    },
}

function renderSearchTree(node, depth, maxDepth) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(`${node.wins.toFixed(3)}/${node.visits}, score: ${node.state.score(node.sideExecutingTheMove)} ${node.move}`));
    if (depth < maxDepth) {
        let ul = document.createElement("ul");
        for (let child of node.children) {
            ul.appendChild(renderSearchTree(child, depth + 1, maxDepth));
        }
        li.appendChild(ul);
    }
    return li;
}

function makeCollapsible() {
    document.querySelectorAll('li').forEach(function(listItem){
        listItem.addEventListener('click', function(e){
            e.stopPropagation();
            let firstUl = this.getElementsByTagName("ul")[0];
            if(firstUl.style.display === "block") {
                firstUl.style.display = "none";
            } else {
                let firstChild = this.children[0];
                if(firstChild.tagName === "UL") {
                    firstChild.style.display = "block";
                }
            }
        });
    });
}

export const treeObserver1 = {
    onEndDecideMove: function (aiPlayer, root) {
        let li = renderSearchTree(root, 0, 3);
        let ul = document.getElementById("search-tree");
        ul.appendChild(li);
        makeCollapsible();
    },
}

export const winLossObserver = {
    onStartDecideMove: function (aiPlayer) {
        this.aiWins = 0;
        this.aiLosses = 0;
        this.draws = 0;
    },
    onSimulateEnd: function (aiPlayer, score) {
        if (score > 0) {
            this.aiWins++;
        } else if (score < 0) {
            this.aiLosses++;
        } else {
            this.draws++;
        }
    },
    onEndDecideMove: function (aiPlayer, root) {
        console.log(`AI wins: ${this.aiWins}, AI losses: ${this.aiLosses}, draws: ${this.draws}`);
    }
}

function notifyStartDecideMove(aiPlayer) {
    for (let observer of aiPlayer.observers) {
        if (observer.onStartDecideMove) {
            observer.onStartDecideMove(aiPlayer);
        }
    }
}

function notifyEndDecideMove(aiPlayer, root) {
    for (let observer of aiPlayer.observers) {
        if (observer.onEndDecideMove) {
            observer.onEndDecideMove(aiPlayer, root);
        }
    }
}

function notifySimulationEnd(aiPlayer, status) {
    for (let observer of aiPlayer.observers) {
        if (observer.onSimulateEnd) {
            observer.onSimulateEnd(aiPlayer, status);
        }
    }
}

// Execute the command many times on different clones of the original state.
// Group the results by equality of the state.
// Return the state with the highest number of occurrences.
export function __executeManyTimes(state, command) {
    const ITERATIONS = 20;
    let stateMap = new Map();
    for (let i = 0; i < ITERATIONS; i++) {
        let clone = state.clone();
        clone.executeCommand(command);
        let key = clone.makeKey();
        if (!stateMap.has(key)) {
            stateMap.set(key, []);
        }
        stateMap.get(key).push(clone);
    }
    let mostFrequentState = undefined;
    let maxCount = 0;
    for (let [key, value] of stateMap) {
        if (value.length > maxCount) {
            maxCount = value.length;
            mostFrequentState = value[0];
        }
    }
    return mostFrequentState;
}

export default class AIPlayer {
    constructor(params) {
        this.aiSide = params.aiSide;
        this.iterations = params.iterations || 10000;
        this.observers = params.observers || [];
        this.playoutPolicy = params.playoutPolicy || playoutTillTheEndPolicy;
    }

    decideMove(state) {
        if (state.isTerminal()) {
            return [];
        }
        if (state.validCommands().length === 1) {
            console.log("-------- AI has one only move: " + state.validCommands()[0]);
            return state.validCommands();
        }

        notifyStartDecideMove(this);
        let root = this.__doDecideMove(state);
        notifyEndDecideMove(this, root);
        return [root.mostVisited().move];
    }

    __doDecideMove(state) {
        let root = makeRootNode(state, state.currentSide);
        for (let i = 0; i < this.iterations; i++) {
            let node = this.select(root);
            let score = this.simulate(node.state);
            this.backpropagate(node, score);
        }
        return root;
    }

    select(node) {
        while (!node.state.isTerminal()) {
            if (node.children.length === 0) {
                return this.expand(node);
            } else {
                node = node.bestChild();
            }
        }
        return node;
    }

    expand(node) {
        for (let command of node.state.validCommands()) {
            const clone = node.state.clone();
            this.pushChild(clone, command, node);
        }
        return node.children[Math.floor(Math.random() * node.children.length)];
    }

    pushChild(clone, command, node) {
        let sideExecutingTheMove = clone.currentSide;
        if (command.isDeterministic()) {
            clone.executeCommand(command);
        } else {
            clone = __executeManyTimes(clone, command);
        }
        node.pushChild(clone, sideExecutingTheMove, command);
        // if (command.constructor.name === "EndPhaseCommand") {
        //     node.children[node.children.length - 1].visits = 70;
        // }
    }

    simulate(state) {
        let clone = state.clone();
        this.playoutPolicy(clone);
        let score = clone.score(this.aiSide);
        notifySimulationEnd(this, score);
        return score;
    }

    backpropagate(node, score) {
        while (node !== null) {
            node.update(score, this.aiSide !== node.sideExecutingTheMove);
            node = node.parent;
        }
    }
}

