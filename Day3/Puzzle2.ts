import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

type Slope = [ number, number ];

/**
 * Returns true if the item represents a tree.
 */
const isTree = (val: string): boolean => {
    return val === '#';
}

/**
 * Counts the number of trees in a grid when traversed using a given slope.
 */
const countTrees = (grid: Array<string>, slope: Slope): number => {
    const gridWidth: number = grid[0].length;
    let treeCount: number = 0;
    grid.forEach((line: string, idx: number) => {
        // Skip over lines that the slope doesn't land on.
        if (idx % slope[1] === 0) {
            // The grid pattern repeats, so use mod to find the idx in the provided grid line.
            const posInLine: number = (idx * slope[0]) % (gridWidth);
            if (isTree(line.charAt(posInLine))) treeCount++;
        }
    });
    return treeCount;
}

/**
 * Returns the product of the number of trees encountered for each slope.
 */
const multiplyTreeCounts = (grid: Array<string>, slopes: Array<Slope>) => { 
    let tally: number = 0;
    slopes.forEach((slope: Slope, idx: number) => {
        const treeCount: number = countTrees(grid, slope);
        tally = (idx === 0) ? treeCount : tally * treeCount;
    });
    return tally;
}

console.log(multiplyTreeCounts(entries, [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]));
