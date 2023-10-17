#!/bin/bash

cd $(dirname $0)/..
set -e

cd src
node --experimental-vm-modules --max-old-space-size=8192 ../script/time.js


