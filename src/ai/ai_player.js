import { chooseBestCommand } from "./autoplay.js";
import { makeRootNode } from "./monte_carlo_tree_search_node.js";

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
        console.log(`tree size: ${root.size()}, shape: ${root.shape()}`, root);
        root.children.sort((a, b) => b.visits - a.visits);
        for (let child of root.children) {
            console.log(`Child move: ${child.move}, score: ${child.wins}/${child.visits}`);
        }
    },
}

export const winLossObserver = {
    onStartDecideMove: function (aiPlayer) {
        this.aiWins = 0;
        this.aiLosses = 0;
        this.draws = 0;
    },
    onSimulateEnd: function (aiPlayer, clone) {
        if (clone.gameStatus === aiPlayer.aiWinStatuses[0]) {
            this.aiWins++;
        } else if (clone.gameStatus === aiPlayer.aiLoseStatuses[0]) {
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

function notifySimulationEnd(aiPlayer, clone) {
    for (let observer of aiPlayer.observers) {
        if (observer.onSimulateEnd) {
            observer.onSimulateEnd(aiPlayer, clone);
        }
    }
}

export default class AIPlayer {
    constructor(params) {
        this.aiWinStatuses = params.aiWinStatuses;
        this.aiLoseStatuses = params.aiLoseStatuses;
        this.aiToken = params.aiToken;
        this.iterations = params.iterations || 10000;
        this.observers = params.observers || [];
    }

    decideMove(state) {
        if (state.validCommands().length === 1) {
            console.log("-------- AI has one only move: " + state.validCommands()[0]);
            return state.validCommands();
        }

        notifyStartDecideMove(this);
        let root = this.__doDecideMove(state);
        notifyEndDecideMove(this, root);
        let moves = root.mostVisitedPath((node) =>
            node.sideExecutingTheMove === this.aiToken && node.move.isDeterministic()
        );
        if (moves.length === 0) {
            return [root.mostVisited().move];
        }
        return moves;
    }

    __doDecideMove(state) {
        this.initVisitData();
        let root = makeRootNode(state, state.currentSide);
        for (let i = 0; i < this.iterations; i++) {
            let node = this.select(root);
            let result = this.simulate(node.state);
            let score = this.gameStatusToScore(result);
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
            const sideExecutingTheMove = clone.currentSide;
            clone.executeCommand(command);
            node.pushChild(clone, sideExecutingTheMove, command);
        }
        return node.children[Math.floor(Math.random() * node.children.length)];
    }

    simulate(state) {
        const clone = state.clone();
        const maxIterations = 1000;
        let iterations = 0;
        while (!clone.isTerminal() && iterations++ < maxIterations) {
            let command = chooseBestCommand(clone);
            clone.executeCommand(command);
        }
        notifySimulationEnd(this, clone);
        return clone.gameStatus;
    }

    backpropagate(node, score) {
        while (node !== null) {
            node.update(score, this.aiToken !== node.sideExecutingTheMove);
            node = node.parent;
        }
    }

    randomCommand(state) {
        let commands = state.validCommands();
        return commands[Math.floor(Math.random() * commands.length)];
    }

    gameStatusToScore(gameStatus) {
        if (this.aiWinStatuses.includes(gameStatus)) {
            return 1;
        } else if (this.aiLoseStatuses.includes(gameStatus)) {
            return -1;
        } else {
            return 0;
        }
    }

    initVisitData() {
        this.moveVisitsData = Object.create(null);
    }

    collectVisitData(root, iteration) {
        if (iteration % 100 !== 0) return;
        for (let child of root.children) {
            if (this.moveVisitsData[child.move] === undefined) {
                this.moveVisitsData[child.move] = [];
            }
            this.moveVisitsData[child.move].push(child.visits);
        }
    }
}

let myChart = undefined;
export function plotData(canvasId, moveVisitsData) {
    if (myChart) {
        myChart.destroy();
    }
    
    let datasets = [];
    let iterations = undefined;
    for (const [key, value] of Object.entries(moveVisitsData)) {
        if (!iterations) iterations = value.map((_, i) => i);
        datasets.push({
            label: key,
            data: value,
            borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate a random color for each move
            fill: false,
        });
    }

    let ctx = document.getElementById(canvasId).getContext('2d');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iterations,
            datasets: datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}