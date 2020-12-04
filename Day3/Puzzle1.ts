import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

/**
 * Returns true if the item represents a tree.
 */
const isTree = (val: string): boolean => {
    return val === '#';
}

/**
 * Counts the number of trees in a grid when traversed using a slope of right 3, down 1.
 */
const countTrees = (grid: Array<string>): number => {
    const gridWidth: number = grid[0].length;
    let treeCount: number = 0;
    grid.forEach((line: string, idx: number) => {
        const posInLine: number = (idx * 3) % (gridWidth);
        if (isTree(line.charAt(posInLine))) treeCount++;
    });
    return treeCount;
}

console.log(countTrees(entries));
