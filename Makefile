.PHONY: arkit madge test server open

test:
	@node --experimental-vm-modules --redirect-warnings=/tmp/jest-warn.txt node_modules/jest/bin/jest.js $*

server:
	@python3 -m http.server

open:
	@open -a "Google Chrome" http://localhost:8000
	@open -a "Google Chrome" http://localhost:8000?scenario=melee

madge:
	@npx madge --image madge.svg src/main.js
	@open -a "Google Chrome" madge.svg
