
export function ensureDefined(value) {
    if (value === undefined) {
        throw new Error("Value is undefined");
    }
    return value;
}

export function ensure(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
