
Graphics are copyright GMT Games, copied from the Vassal CC:A module

# How to

Serve locally with `make server`

Run tests with `make test` (you should `npm install jest` first).  
You may run a single test suite with `./test.sh test/whatever.js`

Play the game with `make open`. Notice the "End phase" and "AI continue" 
buttons, you will need to click them at appropriate times to get the game to proceed. 
Also, keep an AI on the status text on top that tells you which phase the game is in.

In the main scenario (Akragas), you play the Syracusan (bottom) while the AI plays 
the Carthaginian (top). 

# AI TESTS

  - Early game
    - The AI advances compactly -- no weird backward movements
    - The AI advances with all units -- not only the light ones
  - 2on2 Melee
    - advance compactly 
    - Choose attacking a weak unit over a strong one
    - Order combat to maximize potential dice
  - 1to1 Melee
    - light unit avoid close combat

# PROBLEMS AI

 - it does not concentrate fire
 - it does not move troops together

* The AI seems to want to play with one unit at a time
    * Should we encourage to optimize move for each unit separately?
    * It chooses not to fight?!  After advancing adjacent to oppponent?
* In the big scenario, early moves are random


# TODO AI 


- group order moves
- make end phase automatic
- Make the AI give preference to moving/battling with the most constrained unit?
- There seem to be huge redundancies in tree nodes: 5787 / 13982: solve it with grouping moves or with DAG?
- Make scoring return [-1, 1], so to scale expansion factor appropriately
- try again playouts instead of my score?


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


