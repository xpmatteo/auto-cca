
// thanks https://javascript.plainenglish.io/unit-test-front-end-javascript-code-without-a-framework-8f00c63eb7d4

'use strict';

export let failures = 0;

export class AssertionFailed extends Error {
    constructor(message) {
        super(message);
        this.name = 'AssertionFailed';
        failures++;
    }
}

export function fail(message='Assertion failed') {
    throw new AssertionFailed(message);
}

export function assertTrue(isTrue, message='Assertion failed') {
    if (!isTrue) {
        throw new AssertionFailed(message);
    }
}

export function assertFalse(isTrue, message='Assertion failed') {
    if (isTrue) {
        throw new AssertionFailed(message);
    }
}

export function assertEquals(expected, actual, message=undefined) {
    if (message === undefined) {
        message = `Expected ${expected} but got ${actual}`;
    }
    if (expected !== actual) {
        throw new AssertionFailed(message);
    }
}

export function assertEqualsInAnyOrder(expected, actual, message=undefined) {
    let a = JSON.stringify(expected.sort());
    let b = JSON.stringify(actual.sort());
    if (message === undefined) {
        message = `Expected ${a} but got ${b}`;
    }
    if (a !== b) {
        throw new AssertionFailed(message);
    }
}

export function assertDeepEquals(expected, actual, message=undefined) {
    let a = JSON.stringify(expected);
    let b = JSON.stringify(actual);
    if (message === undefined) {
        message = `Expected ${a} but got ${b}`;
    }
    if (a !== b) {
        throw new AssertionFailed(message);
    }
}

export function test(desc, fn) {
    try {
        fn();
        console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
        console.log('\n');
        console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
        console.error(error);
    }
}

export function xtest(desc, fn) {
    console.log('\x1b[90m%s\x1b[0m', '? ' + desc);
}
