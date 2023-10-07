
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

# PROBLEMS AI

Melee scenario:
 - half the units attack, half flee?!
 - it does not maximize dice
 - it does not order attacks so to maximize dice in case of retreat 

 - it does not concentrate fire
 - it does not move troops together
 - it does not understand retreat and fire

Akragas: 
 - AI always plays light troops 
 

# TODO AI 

 - CHECK: choose between attacking a weak unit and a strong one
 - CHECK: order combat to maximize potential dice


- score for a position depends on how many dice I can use to attack
- limit depth of exploration: try to ensure we evaluate multiple times the next moves rather than going too far down

- the evaluation of a position is done on a single roll of dice

- Improve greedy player
  - ? execute random command when same score?
  - ? ensure the greedy player goes for rolling as many dice as possible

- Make the AI give preference to moving/battling with the most constrained unit
- use the greedyplayer to evaluate positions in mcts?
- scoring of enemy moves is always from the POV of the AI player -- this makes the AI choose poor moves for the human player.  Perhaps it should always be scored for the current player, so the choice of best moves is computed correctly
- positional scoring is all wrong -- it should be symmetric and depend on opponent positions

- BUG AI retreat no longer works?
- make dice rolling in AI more deterministic
- (make close combat not optional?  or increase the reward for it?)

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


