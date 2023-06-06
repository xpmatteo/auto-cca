
# How to

Serve locally with `python -m http.server`

Run tests by visiting http://localhost:8000/test.html

See the game by visiting http://localhost:8000/


# Basic design



Game:
   Round -> ChosenCard -> Board
       |--> Scenario   -> Board

UI: uses game

# TODO

 - Rename turn to "CardMoveAllFightNone"
 - Implement Round 
 - Implement Deck
 - Restrict clicks to moving own unspent units 
 - fighting
 