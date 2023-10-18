.PHONY: test server open madge

test:
	@script/test.sh

server:
	@python3 -m http.server

open:
	@osascript -e 'tell application "Google Chrome"' -e 'make new window' -e 'activate' -e 'end tell'
	@open -a "Google Chrome" http://localhost:8000?scenario=akragas
	@open -a "Google Chrome" http://localhost:8000?scenario=melee
	@open -a "Google Chrome" http://localhost:8000?scenario=oneToOneMelee
	@open -a "Google Chrome" http://localhost:8000?scenario=twoOnTwoMelee

tree:
	@open -a "Google Chrome" "http://localhost:8000/tree.html?scenario=oneToOneMelee&iterations=3000&depth=15&threshold=0&prune=5"

madge:
	@npx madge --image madge.svg src/main.js
	@open -a "Google Chrome" madge.svg
