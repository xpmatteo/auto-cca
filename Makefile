.PHONY: test server open madge dot cloc

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
	@open -a "Google Chrome" http://localhost:8000?scenario=heavyVersusLight

tree:
	@open -a "Google Chrome" "http://localhost:8000/tree.html?scenario=akragas&iterations=3000&playouts=10&depth=6&threshold=0&prune=0"

madge:
	@npx madge --image /tmp/madge.svg src/main.js
	@open -a "Google Chrome" /tmp/madge.svg

dot:
	dot -O -Tpng doc/close-combat.dot
	open doc/close-combat.dot.png

cloc:
	@cloc --exclude-ext=test.js src
