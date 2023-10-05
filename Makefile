.PHONY: arkit madge test server open

test:
	@./test.sh

server:
	@python3 -m http.server

open:
	@open -a "Google Chrome" http://localhost:8000?scenario=akragas
	@open -a "Google Chrome" http://localhost:8000?scenario=melee
	@open -a "Google Chrome" http://localhost:8000?scenario=oneToOneMelee

madge:
	@npx madge --image madge.svg src/main.js
	@open -a "Google Chrome" madge.svg
