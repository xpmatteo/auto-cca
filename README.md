
Graphics are copyright GMT Games, copied from the Vassal CC:A module

# How to

Serve locally with `make server` or `python -m http.server`

Run tests with `make test` (you should `npm install jest` first).  
You may run a single test suite with `script/test.sh test/whatever.js`

Play the game with `make open`. Notice the "End phase" and "AI continue" 
buttons, you will need to click them at appropriate times to get the game to proceed. 
Also, keep an AI on the status text on top of the page: it tells you which phase the game is in.

Open your browser's developer tools to read the AI logs.

Configure the AI parameters in file `src/config.js`. 

In the main scenario (Akragas), you play the Syracusan (bottom) while the MCTS AI plays 
the Carthaginian (top).

The Playout button pits the MCTS AI (bottom) against a greedy player (top).  You can speed up 
or slow down the moves with the `delay` value in the textbox.

# AI BUGS

 - Ak
   - it still does not use all the attacks it has
 - 1-1: it avoids further conflict when it's advantaged
 - 2-2:
   - it does not concentrate the attacks
   - it runs away instead of fighting?


# AI TESTS

  - Early game
    - The AI advances compactly -- no weird backward movements
    - The AI advances with all units -- not only the light ones
  - 2on2 Melee
    - should advance compactly 
    - should choose attacking a weak unit over a strong one
    - should order combat to maximize potential dice
  - 1to1 Melee
    - light unit to avoid close combat


# TODO AI 

- group order moves: make the UI think about each unit in turn, and make endPhase available only at the end
- open loop instead of chance nodes
- implement evasion and line-of-sight rules for ranged combat, to allow the realistic game strategy to emerge
- make end phase automatic
- try again playouts instead of my score?
- ??? Make scoring return [-1, 1], so to scale expansion factor appropriately ???


# TODO RULES

- evasion
- ranged combat line of sight restriction
- more cards
- advance after combat
- cavalry, chariot battle again after advance
- leaders
- terrain
- "if you don't have any X unit, order a unit of your choice"
- heavy chariot battles back with 3 dice not 4
- heavy chariot ignores one sword result


