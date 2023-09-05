.PHONY: arkit madge test server open

test:
	@node --experimental-vm-modules --redirect-warnings=/tmp/jest-warn.txt node_modules/jest/bin/jest.js $*

server:
	@python3 -m http.server

open:
	@open -a "Google Chrome" http://localhost:8000

arkit:
	@npx arkit -f src/main.js -o arkit.svg
	@open -a "Google Chrome" arkit.svg

madge:
	@npx madge --image madge.svg src/main.js
	@open -a "Google Chrome" madge.svg
