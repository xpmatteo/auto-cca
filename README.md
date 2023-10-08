
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

# TODO: scoreMcts must ensure a score boost for the winner!!!

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
 - it does not understand retreat and fire

 

# TODO AI 

- score for a position should depend on how many dice I can use to attack
- limit depth of exploration: try to ensure we evaluate multiple times the next moves rather than going too far down

- the evaluation of a position is done on a single roll of dice

- Improve greedy player
  - ? execute random command when same score?
  - ? ensure the greedy player goes for rolling as many dice as possible

- Make the AI give preference to moving/battling with the most constrained unit


# TODO RULES

- evasion
- more cards
- advance after combat
- ranged combat line of sight restriction
- cavalry, chariot battle again after advance
- leaders
- terrain
- "if you don't have any X unit, order a unit of your choice"
- heavy chariot battles back with 3 dice not 4
- heavy chariot ignores one sword result


