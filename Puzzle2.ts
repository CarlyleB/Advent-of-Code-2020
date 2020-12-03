import { readFileSync } from 'fs';

const GOAL: number = 2020;

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').map((x) => parseInt(x));

const evalEntries = (items: Array<number>): number => {
    let prod: number = 0;
    items.find((x, idx) => {
        return items.slice(idx + 1).find((y, idxy) => {
            return (x + y < GOAL) && (items.slice(idxy + 1).find((z) => {
                const foundMatch: boolean = (x + y + z === GOAL);
                if (foundMatch) {
                    prod = x * y * z;
                    console.log('Found ' + x + ' and ' + y + ' and ' + z);
                }
                return foundMatch;
            }) !== undefined);
        }) !== undefined;
    });
    return prod;
}

console.log(evalEntries(entries));
