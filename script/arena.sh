#!/bin/bash

cd $(dirname $0)/..
set -e

cd src
node --experimental-vm-modules ../script/arena.js


