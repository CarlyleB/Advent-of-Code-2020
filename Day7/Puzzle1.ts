import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

interface Bag {
    color: string;
    children: Array<number>;
    parents: Array<number>;
}

interface BagDescription {
    color: string;
    canContain: Array<BagCapacity>;
    canBeIn: Array<string>;
}

interface BagCapacity {
    color: string;
    quantity: number;
}



const getBag = (val: string): BagDescription => {
    const splitVal: Array<string> = val.split(' bags contain ');
    const color: string = splitVal[0];
    const nestedBags: Array<string> = splitVal[1].split(', ');
    //console.log('bag: ' + color);
    const bd: BagDescription = {
        color: color,
        canBeIn: [],
        canContain:[]
    };
    //if (color === 'striped white') console.log(nestedBags);
    //console.log(nestedBags);
    nestedBags.forEach((nestedBagStr: string, i: number) => {
        const quantityStr: string = nestedBagStr.split(' ')[0];
        const quantity: number = parseInt(quantityStr);
        const remainder: string = nestedBagStr.substring(quantityStr.length + 1);
        const splitRemainder: Array<string> = remainder.split(' ');
        const lastWord: string = splitRemainder[splitRemainder.length - 1];
        let nestedColor: string = remainder.substring(0, remainder.length - lastWord.length).trimStart().trimEnd();
        bd.canContain.push({ quantity: quantity, color: nestedColor });
        //if (color === 'striped white') console.log(nestedColor.trimStart().trimEnd().length);
        if (nestedColor === 'shiny gold') console.log(color);
        //console.log('color: ' + nestedColor + ', quantity: ' + quantity);
    });
    //console.log(bag);
    // bag.canContain.forEach((bagCap: BagCapacity) => { if (bagCap.color === 'shiny gold') console.log(bagCap) });
    return bd;
}

const getBags = (vals: Array<string>): number => {
    const bags: Array<Bag> = [];
    vals.forEach((val: string) => {
        if (val.length > 0) {
            const bd: BagDescription = getBag(val);
            let bagIdx: number = bags.findIndex((b: Bag) => b.color === bd.color);
            if (bd.color === 'shiny gold') console.log('YES - ' + bagIdx);
            if (bagIdx < 0) {
                bags.push({ color: bd.color, children: [], parents: [] });
                bagIdx = bags.length - 1;
            }
            bd.canContain.forEach((bagCap: BagCapacity) => {
                let bagCapIdx: number = bags.findIndex((b: Bag) => b.color === bagCap.color);
                if (bagCap.color === 'shiny gold') console.log('yes');
                if (bagCapIdx >= 0) {
                    // console.log('before: ');
                    // console.log(bags[bagCapIdx].canBeIn);
                    bags[bagCapIdx].parents.push(bagIdx);
                    // console.log('after: ');
                    // console.log(bags[bagCapIdx].canBeIn);
                } else {
                    bags.push({ color: bagCap.color, parents: [bagIdx], children: [] });
                    bagCapIdx = bags.length - 1;
                }
                bags[bagIdx].children.push(bagCapIdx);
            });
            
        }
    });
    console.log(vals.length);
    console.log(bags.length);

    const holds = (b: Bag, color: string): boolean => {
        return b.children.findIndex((a) => bags[a].color === color) >= 0 || b.children.findIndex((x) => holds(bags[x], color)) >= 0;
    }

    const totalValue: number = bags.filter((b) => holds(b, 'shiny gold')).length;
    return totalValue;
}

console.log(getBags(entries));
