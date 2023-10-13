
cd $(dirname $0)/..
set -e

cd src
node --experimental-vm-modules ../script/tree-dot.js
neato -Tsvg /tmp/tree.dot -o /tmp/tree.svg
open -a "Google Chrome" /tmp/tree.svg


