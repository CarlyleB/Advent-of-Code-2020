import { readFileSync } from 'fs';

const GOAL: number = 2020;

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').map((x) => parseInt(x));

const evalEntries = (items: Array<number>): number => {
    const item = items.find((x, idx) => {
        return items.slice(idx + 1).find((y) => x + y === GOAL) !== undefined;
    });
    return item ? item * (GOAL - item) : -1;
}

console.log(evalEntries(entries));
