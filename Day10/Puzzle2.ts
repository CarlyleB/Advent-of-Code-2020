import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').reduce((filtered: Array<number>, val: string) => {
    if (val.length) filtered.push(parseInt(val));
    return filtered;
}, []);

interface JoltageAdapter {
    joltage: number;
    mates: Array<JoltageAdapter>;
}

interface LevelNode { adapter: JoltageAdapter, count: number }

type LevelNodes = Array<LevelNode>;

class AdapterService {
    public countAdapterArrangements = (joltages: Array<number>): number => {
        const adapters: Array<JoltageAdapter> = this._createAdapters(joltages);
        let nodes: LevelNodes = [{ adapter: adapters[0], count: 1 }];
        const goal: JoltageAdapter = adapters[adapters.length - 1];
        let count: number = 0;
        while (nodes.length > 0) {
            console.log(nodes);
            nodes = this._getLevelNodes(nodes);
            
            const goalNode: LevelNode | undefined = nodes.find((node: LevelNode) => node.adapter.joltage === goal.joltage);
            if (goalNode !== undefined) count += goalNode.count;
        }
        return count;
    }

    private readonly _getLevelNodes = (prevNodes: LevelNodes): LevelNodes => {
        const nodes: LevelNodes = [];
        prevNodes.forEach((prevNode: LevelNode) => {
            prevNode.adapter.mates.forEach((mate: JoltageAdapter) => {
                let mateIdx: number = nodes.findIndex((node: LevelNode) => node.adapter === mate);
                if (mateIdx < 0) {
                    nodes.push({ adapter: mate, count: prevNode.count });
                } else {
                    nodes[mateIdx].count += prevNode.count;
                }
            });
        });
        return nodes;
    }

    private readonly _createAdapters = (joltages: Array<number>): Array<JoltageAdapter> => {
        const jSorted: Array<number> = joltages.sort((a: number, b: number) => a - b);
        const goal: number = jSorted[jSorted.length - 1] + 3;
        jSorted.unshift(0);
        jSorted.push(goal);
        const adapters: Array<JoltageAdapter> = [];
        for (let i: number = 0; i < jSorted.length; i++) {
            let j: number = 1;
            let adapterIdx: number = adapters.findIndex((a: JoltageAdapter) => a.joltage === jSorted[i]);
            if (adapterIdx < 0) {
                adapterIdx = adapters.push({ joltage: jSorted[i], mates: [] }) - 1;
            }
            console.log('joltage: ' + jSorted[i]);
            while (jSorted[i + j] - jSorted[i] <= 3) {
                let mateIdx: number = adapters.findIndex((a: JoltageAdapter) => a.joltage === jSorted[i + j]);
                console.log(adapters);
                console.log('mate: ' + jSorted[i + j]);
                if (mateIdx < 0) {
                    mateIdx = adapters.push({ joltage: jSorted[i + j], mates: [] }) - 1;
                }
                console.log('mateIdx: ' + mateIdx);
                adapters[adapterIdx].mates.push(adapters[mateIdx]);
                j++;
            }
        }
        console.log('jSorted.length: ' + jSorted.length);
        console.log('adapters.length: ' + adapters.length);
        return adapters;
    }

    public multiplyDiffDistrubutions = (joltages: Array<number>): number => {
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

const adapterService: AdapterService = new AdapterService();
console.log(adapterService.countAdapterArrangements(entries));






