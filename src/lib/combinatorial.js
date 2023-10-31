
/**
 * @function
 * @template A
 * @param {A[]} array
 * @param {number} n
 * @returns {A[][]}
 */
export function choose(array, n){
    if(n === 0){
        return [[]];
    }
    if(array.length === 0){
        return [];
    }
    // magic provided by co-pilot.
    const [head, ...tail] = array;
    const withHead = choose(tail, n - 1).map((xs) => [head, ...xs]);
    const withoutHead = choose(tail, n);
    return [...withHead, ...withoutHead];
}
