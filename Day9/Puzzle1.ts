import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').filter((x)=> x.length > 0).map((x) => parseInt(x));

const PREAMBLE_LEN: number = 25;

class XMASDecoder {

    public findInvalidValue = (preamble: number, vals: Array<number>): number => {
        let weakness: number = -1;
        let i: number = preamble;
        while (i < vals.length && weakness < 0) {
            if (!this.includesSum(vals[i], vals.slice(i - 25, i))) weakness = vals[i];
            i++;
        }
        return weakness;
    }

    public includesSum = (sum: number, vals: Array<number>): boolean => {
        let foundSum: boolean = false;
        let i: number = 0;
        console.log(vals);
        while (i < vals.length && !foundSum) {
            const match: number = sum - vals[i];
            console.log('val: ' + vals[i] + ', match: ' + match);
            const matchIdx: number = vals.findIndex((x) => x === match);
            foundSum = (matchIdx >= 0);
            i++;
        }
        return foundSum;
    }
}

const decoder: XMASDecoder = new XMASDecoder();
console.log(decoder.findInvalidValue(PREAMBLE_LEN, entries));
