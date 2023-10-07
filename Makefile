.PHONY: test server open madge

test:
	@./test.sh

server:
	@python3 -m http.server

open:
	@osascript -e 'tell application "Google Chrome"' -e 'make new window' -e 'activate' -e 'end tell'
	@open -a "Google Chrome" http://localhost:8000?scenario=akragas
	@open -a "Google Chrome" http://localhost:8000?scenario=melee
	@open -a "Google Chrome" http://localhost:8000?scenario=oneToOneMelee
	@open -a "Google Chrome" http://localhost:8000?scenario=twoOnTwoMelee

madge:
	@npx madge --image madge.svg src/main.js
	@open -a "Google Chrome" madge.svg
