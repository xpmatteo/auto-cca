
// thanks https://javascript.plainenglish.io/unit-test-front-end-javascript-code-without-a-framework-8f00c63eb7d4

'use strict';

export function assertTrue(isTrue, message='Assertion failed') {
    if (!isTrue) {
        throw new Error(message);
    }
}

export function assertFalse(isTrue, message='Assertion failed') {
    if (isTrue) {
        throw new Error(message);
    }
}

export function assertEquals(expected, actual, message=undefined) {
    if (message === undefined) {
        message = `Expected ${expected} but got ${actual}`;
    }
    if (expected !== actual) {
        throw new Error(message);
    }
}

export function assert_deep_equals(expected, actual, message='Assertion failed') {
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        throw new Error(message);
    }
}

export function it(desc, fn) {
    try {
        fn();
        console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
        console.log('\n');
        console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
        console.error(error);
    }
}

export const test = it;
