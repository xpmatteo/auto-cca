.PHONY: arkit madge test server open

server:
	@python -m http.server

open:
	@open -a "Google Chrome" http://localhost:8000

test:
	@open -a "Google Chrome" http://localhost:8000/test.html

arkit:
	@npx arkit -f src/main.js -o arkit.svg
	@open -a "Google Chrome" arkit.svg

madge:
	@npx madge --image madge.svg src/main.js
	@open -a "Google Chrome" madge.svg	