#!/bin/bash

cd $(dirname $0)/..

node --experimental-vm-modules --redirect-warnings=/tmp/jest-warn.txt node_modules/jest/bin/jest.js $*
