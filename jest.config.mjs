export default {
    moduleFileExtensions: [
        "mjs",
        // must include "js" to pass validation https://github.com/facebook/jest/issues/12116
        "js",
    ],
    testRegex: `test\.js$`,
    // roots: ["<rootDir>/test"],
    moduleNameMapper: {
        'ai/(.*)': '<rootDir>/src/ai/$1',
        'xlib/(.*)': '<rootDir>/src/lib/$1',
        'model/(.*)': '<rootDir>/src/model/$1',
    },

};
