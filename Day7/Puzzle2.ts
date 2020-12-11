import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

interface Bag {
    color: string;
    children: Array<ChildBag>;
}

interface ChildBag {
    quantity: number;
    color: string;
}

const getBag = (val: string): Bag => {
    const splitVal: Array<string> = val.split(' bags contain ');
    const color: string = splitVal[0];
    const childBags: Array<string> = splitVal[1].split(', ');
    //console.log('bag: ' + color);
    const bag: Bag = {
        color: color,
        children: []
    };
    //if (color === 'striped white') console.log(childBags);
    //console.log(childBags);
    if (childBags[0] !== 'no other bags.') {
        childBags.forEach((childBagstr: string) => {
            const quantityStr: string = childBagstr.split(' ')[0];
            const quantity: number = parseInt(quantityStr);
            const remainder: string = childBagstr.substring(quantityStr.length + 1);
            const splitRemainder: Array<string> = remainder.split(' ');
            const lastWord: string = splitRemainder[splitRemainder.length - 1];
            let nestedColor: string = remainder.substring(0, remainder.length - lastWord.length).trimStart().trimEnd();
            bag.children.push({ quantity: quantity, color: nestedColor });
            //if (color === 'striped white') console.log(nestedColor.trimStart().trimEnd().length);
            if (nestedColor === 'shiny gold') console.log(color);
            //console.log('color: ' + nestedColor + ', quantity: ' + quantity);
        });
    }
    //console.log(bag);
    // bag.canContain.forEach((bagCap: BagCapacity) => { if (bagCap.color === 'shiny gold') console.log(bagCap) });
    return bag;
}

const getBags = (vals: Array<string>): number => {
    const bags: Array<Bag> = [];
    vals.forEach((val: string) => {
        if (val.length > 0) {
            bags.push(getBag(val));
/*             bag.children.forEach((child: ChildBag) => {
                let childIdx: number = bags.findIndex((b: Bag) => b.color === child.color);
                if (child.color === 'shiny gold') console.log('yes');
                if (childIdx >= 0) {
                    b
                    // console.log('after: ');
                    // console.log(bags[bagCapIdx].canBeIn);
                } else {
                    bags.push({ color: bagCap.color, children: [] });
                    bagCapIdx = bags.length - 1;
                }
                bags[bagIdx].children.push({ quantity: bagCap.quantity, index: bagCapIdx });
            }); */
            
        }
    });
    console.log(vals.length);
    console.log(bags.length);

    const findBag = (color: string): Bag => {
        const bag = bags.find((x) => x.color === color)!;
        return bag;
    }

    const holds = (b: Bag, color: string): boolean => {
        return b.children.length > 0 && (b.children.findIndex((a) => a.color === color) >= 0 || b.children.findIndex((x) => holds(findBag(x.color), color)) >= 0);
    }

    const countChildren = (bag: Bag) => {
        let childQuantity = 0;
        console.log(bag.children);
        //console.log(bag.color + ' can contain ' + bag.children);
        bag.children.forEach((child) => {
            //console.log('color: ' + child.color + ' quantity: ' + child.quantity);
            childQuantity += child.quantity + (child.quantity * (countChildren(findBag(child.color))))
            //console.log(childQuantity);
        });
        return childQuantity;
    }

    const totalValue = countChildren(findBag('shiny gold'));
    return totalValue;
}

console.log(getBags(entries));
