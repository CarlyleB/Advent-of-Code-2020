import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').reduce((filtered: Array<number>, val: string) => {
    if (val.length) filtered.push(parseInt(val));
    return filtered;
  }, []);

class AdapterService {
    
    static multiplyDiffDistrubutions = (joltages: Array<number>): number => {
        const jSorted: Array<number> = joltages.sort((a: number, b: number) => a - b);
        jSorted.unshift(0); // The charging outlet is 0 jolts
        jSorted.push(jSorted[jSorted.length - 1] + 3); // Your own device is 3 jolts higher than the highest adapter
        let ones: number = 0;
        let threes: number = 0;
        for (let i: number = 1; i < jSorted.length; i++) {
            const diff: number = jSorted[i] - jSorted[i - 1];
            if (diff === 1) ones++
            else if (diff === 3) threes++;
        }
        return ones * threes;
    }
}

console.log(AdapterService.multiplyDiffDistrubutions(entries));
