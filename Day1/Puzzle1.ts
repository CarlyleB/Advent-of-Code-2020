import { readFileSync } from 'fs';

const GOAL: number = 2020;

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').map((x) => parseInt(x));

/**
 * Finds the two entries that sum to 2020 and returns their product.
 */
const evalEntries = (items: Array<number>): number => {
    const findMatch = (x: number, idx: number) => {
        return items.slice(idx + 1).find((y) => x + y === GOAL) !== undefined;
    }
    const item = items.find(findMatch);
    return (item !== undefined) ? item * (GOAL - item) : -1;
}

console.log(evalEntries(entries));
