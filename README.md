
[![CI](https://github.com/xpmatteo/auto-cca/actions/workflows/ci.yml/badge.svg)](https://github.com/xpmatteo/auto-cca/actions/workflows/ci.yml)

Graphics are Copyright GMT Games, copied from the Vassal CC:A module

This work is intended exclusively for education and learning about game-playing AI.

I presented this work in progress at Codemotion Milano 2023; [here are the slides](https://speakerdeck.com/xpmatteo/an-ai-for-a-complex-boardgame-based-on-monte-carlo-tree-search).

# How to

Serve locally with `make server` or `python -m http.server`

Run tests with `make test` (you should `npm install jest` first).  
You may run a single test suite with `script/test.sh src/whatever.test.js`

Play the game with `make open`. Notice the "End phase" and "AI continue" 
buttons, you will need to click them at appropriate times to get the game to proceed. 
Also, keep an AI on the status text on top of the page: it tells you which phase the game is in.

Open your browser's developer tools to read the AI logs.

Configure the AI parameters in file `src/config.js`. 

In the main scenario (Akragas), you play the Syracusan (bottom) while the MCTS AI plays 
the Carthaginian (top).

The Playout button pits the MCTS AI (bottom) against a greedy player (top).  You can speed up 
or slow down the moves with the `delay` value in the textbox.

See a visualization of the search tree with `make tree`.  You can tweak the parameters to change 
the level of detail you want, however be mindful that the more nodes you show, the longer it takes for the
image to appear.  The parameters are:
 
  * scenario: the key of the scenario to run
  * depth: how many levels of the tree to show (don't set it too high or it will take forever to get a picture)
  * threshold: the minimum number of visits below which we don't show a node
  * prune *n*: for the first *n* nodes in the tree, we only show the main line, not showing other subtrees
  * iterations, playouts: configure AI parameters

# WIP

    BUG combat with evasion does not "spend" the attacking unit

  * implement MAP_CENTER and MAP_EAST

# AI TESTS

  - Early game
    - The AI should advance compactly -- no weird backward movements
    - The AI should use all units -- not just the light ones
  - 2on2 Melee
    - should advance compactly 
    - should choose attacking a weak unit over a strong one
    - should order combat to maximize potential dice
  - 1to1 Melee
    - light unit to avoid close combat
    - light unit to keep pestering the heavy with bows


# TODO AI 

- macro-move sampling: avoid duplicate macro-moves in a node's children
- macro-move sampling: make units not moving an option
- macro-move sampling: tune the explore/exploit ratio
- open loop instead of chance nodes
- implement evasion, to allow the expected game strategy to emerge
- make end phase automatic


# TODO RULES

- more cards
- cavalry bonus movement
- cavalry, chariot bonus combat
- leaders
- terrain
- "if you don't have any X unit, order a unit of your choice"
- heavy chariot battles back with 3 dice not 4
- heavy chariot ignores one sword result
- warriors, elephants, other units


