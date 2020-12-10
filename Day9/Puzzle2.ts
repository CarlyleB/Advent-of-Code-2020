import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').filter((x)=> x.length > 0).map((x) => parseInt(x));

const PREAMBLE_LEN: number = 25;

class XMASDecoder {

    public findEncryptionWeakness = (preamble: number, vals: Array<number>): number => {
        const invalidVal: number = this.findInvalidValue(preamble, vals);
        let foundWeakness: number = -1;
        let i: number = 0;
        while (i < vals.length && foundWeakness < 0) {
            let j: number = i;
            let sum: number = vals[i];
            let largest: number = vals[i];
            let smallest: number = vals[i];
            while (j < vals.length && sum < invalidVal) {
                j++;
                sum += vals[j];
                if (vals[j] < smallest) smallest = vals[j];
                if (vals[j] > largest) largest = vals[j];
            }
            if (sum === invalidVal) foundWeakness = smallest + largest;
            i++;
        }
        return foundWeakness;
    }

    public findInvalidValue = (preamble: number, vals: Array<number>): number => {
        let invalidVal: number = -1;
        let i: number = preamble;
        while (i < vals.length && invalidVal < 0) {
            if (!this.includesSum(vals[i], vals.slice(i - 25, i))) invalidVal = vals[i];
            i++;
        }
        return invalidVal;
    }

    public includesSum = (sum: number, vals: Array<number>): boolean => {
        let foundSum: boolean = false;
        let i: number = 0;
        while (i < vals.length && !foundSum) {
            const match: number = sum - vals[i];
            const matchIdx: number = vals.findIndex((x) => x === match);
            foundSum = (matchIdx >= 0);
            i++;
        }
        return foundSum;
    }
}

const decoder: XMASDecoder = new XMASDecoder();
console.log(decoder.findEncryptionWeakness(PREAMBLE_LEN, entries));
