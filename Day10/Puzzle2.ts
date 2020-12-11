import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<number> = file.split('\n').reduce((filtered: Array<number>, val: string) => {
    if (val.length) filtered.push(parseInt(val));
    return filtered;
}, []);

interface Node {
    val: number;
    children: Array<Node>;
}

interface NodeCount {
    node: Node;
    count: number;
}

type Level = Array<NodeCount>;

class NodeService {
    public countNodeArrangements = (vals: Array<number>): number => {
        const nodes: Array<Node> = this._createNodes(vals);
        let level: Level = [{ node: nodes[0], count: 1 }];
        const goalNode: Node = nodes[nodes.length - 1];
        let count: number = 0;
        while (level.length > 0) {
            level = this._getNextLevel(level);
            const goalNodeCount: NodeCount | undefined = level.find((nodeCount: NodeCount) => nodeCount.node.val === goalNode.val);
            if (goalNodeCount !== undefined) count += goalNodeCount.count;
        }
        return count;
    }

    private readonly _getNextLevel = (prevLevel: Level): Level => {
        const level: Level = [];
        prevLevel.forEach((prevNodeCount: NodeCount) => {
            prevNodeCount.node.children.forEach((child: Node) => {
                let childIdx: number = level.findIndex((nodeCount: NodeCount) => nodeCount.node.val === child.val);
                if (childIdx < 0) {
                    level.push({ node: child, count: prevNodeCount.count });
                } else {
                    level[childIdx].count += prevNodeCount.count;
                }
            });
        });
        return level;
    }

    private readonly _createNodes = (vals: Array<number>): Array<Node> => {
        const sortedVals: Array<number> = vals.sort((a: number, b: number) => a - b);
        const goal: number = sortedVals[sortedVals.length - 1] + 3;
        sortedVals.unshift(0);
        sortedVals.push(goal);
        const nodes: Array<Node> = [];
        for (let i: number = 0; i < sortedVals.length; i++) {
            let j: number = 1;
            let nodeIdx: number = nodes.findIndex((node: Node) => node.val === sortedVals[i]);
            if (nodeIdx < 0) {
                nodeIdx = nodes.push({ val: sortedVals[i], children: [] }) - 1;
            }
            while (sortedVals[i + j] - sortedVals[i] <= 3) {
                let childIdx: number = nodes.findIndex((node: Node) => node.val === sortedVals[i + j]);
                if (childIdx < 0) {
                    childIdx = nodes.push({ val: sortedVals[i + j], children: [] }) - 1;
                }
                nodes[nodeIdx].children.push(nodes[childIdx]);
                j++;
            }
        }
        return nodes;
    }
}

const nodeService: NodeService = new NodeService();
console.log(nodeService.countNodeArrangements(entries));
