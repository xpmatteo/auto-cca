import {chooseBestCommand} from "./autoplay.js";

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
}

export default class AIPlayer {
    constructor(params) {
        this.aiWinStatuses = params.aiWinStatuses;
        this.aiLoseStatuses = params.aiLoseStatuses;
        this.aiToken = params.aiToken;
        this.iterations = params.iterations || 10000;
    }

    decideMove(state) {
        this.aiWins = 0;
        this.aiLosses = 0;
        this.draws = 0;

        if (state.validCommands().length === 1) {
            console.log("-------- AI has one only move: " + state.validCommands()[0]);
            return state.validCommands()[0];
        }
        console.log("-------- AI is thinking... ---------");
        const start = performance.now();

        let root = this.__doDecideMove(state);

        const end = performance.now();
        const timeInSeconds = ((end - start) / 1000).toFixed(2);
        const timePerIteration = (end - start) / this.iterations;
        this.displayInformation(root);
        console.log(`AI took ${timeInSeconds} seconds to decide; ${timePerIteration.toFixed(2)} ms per iteration`);
        console.log(`AI wins: ${this.aiWins}, AI losses: ${this.aiLosses}, draws: ${this.draws}`);
        return root.mostVisited().move;
    }

    __doDecideMove(state) {
        this.initVisitData();
        let root = new MonteCarloTreeSearchNode(state, state.currentSide);
        for (let i = 0; i < this.iterations; i++) {
            let node = this.select(root);
            let result = this.simulate(node.state);
            let score = this.gameStatusToScore(result);
            this.backpropagate(node, score);
            //this.collectVisitData(root, i);
        }
        return root;
    }

    displayInformation(root) {
        console.log(`tree size: ${root.size()}`, root);
        root.children.sort((a, b) => b.visits - a.visits);
        for (let child of root.children) {
            console.log(`Child move: ${child.move}, score: ${child.wins}/${child.visits}`);
        }
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
            node.children.push(new MonteCarloTreeSearchNode(clone, sideExecutingTheMove, node, command));
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
        this.lastSimulateResult = clone.gameStatus;
        if (clone.gameStatus === this.aiWinStatuses[0]) {
            this.aiWins++;
        } else if (clone.gameStatus === this.aiLoseStatuses[0]) {
            this.aiLosses++;
        } else {
            this.draws++;
        }
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