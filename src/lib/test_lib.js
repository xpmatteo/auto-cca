
// thanks https://javascript.plainenglish.io/unit-test-front-end-javascript-code-without-a-framework-8f00c63eb7d4

'use strict';

export let failures = 0;
export let ignored = 0;

export class AssertionFailed extends Error {
    constructor(message) {
        super(message);
        this.name = 'AssertionFailed';
    }
}

export function fail(message='Assertion failed') {
    throw new AssertionFailed(message);
}

export function assertTrue(isTrue, message='Assertion failed') {
    expect(isTrue).toBe(true);
}

export function assertFalse(isTrue, message='Assertion failed') {
    expect(isTrue).toBe(false);
}

export function assertThrows(closure, message='Expected to throw an exception') {
    expect(closure).toThrow();
}

export function assertEquals(expected, actual, message=undefined) {
    expect(actual).toEqual(expected);
}

export function assertAlmostEquals(expected, actual, epsilon=0.0000001, message=undefined) {
    expect(actual).toBeCloseTo(expected, epsilon);
}

export function assertEqualsInAnyOrder(expected, actual, message=undefined) {
    expect(actual.length).toEqual(expected.length);
    expect(new Set(actual)).toEqual(new Set(expected));
}

export function assertDeepEquals(expected, actual, message="Assertion failed") {
    expect(actual).toEqual(expected);
}

export function assertDeepEqualsObject(expected, actual, message="Assertion failed") {
    expect(actual).toEqual(expected);
}

// export function test(desc, fn) {
//     try {
//         fn();
//         console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
//     } catch (error) {
//         failures++;
//         console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
//         console.error(error);
//     }
// }
//
// export function xtest(desc, fn) {
//     ignored++;
//     console.log('\x1b[90m%s\x1b[0m', '? ' + desc);
// }
