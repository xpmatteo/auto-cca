
Graphics are copyright GMT Games, copied from the Vassal CC:A module

# How to

Serve locally with `make server`

Run tests with `make test` (you should `npm install jest` first)

Play the game with `make open`. Notice the "End phase" and "AI continue" 
buttons, you will need to click them at appropriate times to get the game to proceed. 
Also, keep an AI on the status text on top that tells you which phase the game is in.

In the main scenario (Akragas), you play the Syracusan (bottom) while the AI plays 
the Carthaginian (top). 

# AI things to try

- scoring of enemy moves is always from the POV of the AI player -- this makes the AI choose poor moves for the human player.  Perhaps it should always be scored for the current player, so the choice of best moves is computed correctly
- Make the AI give preference to moving/battling with the most constrained unit
- positional scoring is all wrong -- it should be symmetric and depend on opponent positions

- BUG AI retreat no longer works?
- make dice rolling in AI more deterministic
- (make close combat not optional?  or increase the reward for it?)

# TODO


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


