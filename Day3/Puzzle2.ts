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
    const [gridWidth, gridHeight]: [number, number] = [grid[0].length, grid.length];
    let treeCount: number = 0;
    let lineIdx: number = 0;
    while (lineIdx < gridHeight) {
        // The grid pattern repeats, so use mod to find the idx in the provided grid line.
        const posInLine: number = (lineIdx * slope[0]) % (gridWidth);
        if (isTree(grid[lineIdx].charAt(posInLine))) treeCount++;
        lineIdx += slope[1];
    }
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
