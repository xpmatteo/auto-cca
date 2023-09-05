
export function mapToString(map) {
    return JSON.stringify(Object.fromEntries(map));
}

export function stringify(items) {
    let result = "";
    for (let item of items) {
        result += item.toString() + "+";
    }
    return result;
}

