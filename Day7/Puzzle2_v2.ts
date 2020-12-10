import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

type BagContents  = Array<ChildBag>;

interface ChildBag {
    amt: number;
    bag: Bag;
}

class Bag {
    private readonly color: string;
    private children: BagContents;

    constructor (color: string, children?: BagContents) {
        this.color = color;
        this.children = children || [];
    }

    public getColor = (): string => {
        return this.color;
    }

    public numChildren = (): number => {
        return this.children.length;
    }

    public isColor = (color: string): boolean => {
        return this.color === color;
    }

    public hasChild = (color: string): boolean => {
        return this.children.findIndex((c: ChildBag) => c.bag.color === color) >= 0;
    }

    public getColorCapacity = (color: string): number => {
        const child: ChildBag | undefined = this.getChildByColor(color);
        if (child !== undefined) {
            return child.amt;
        }
        return 0
    }

    public getChildByColor = (color: string): ChildBag | undefined => {
        return this.children.find((c: ChildBag) => c.bag.color === color);
    }

    public getChildren = (): BagContents => {
        return this.children;
    }

    public setChildren = (children: BagContents): void => {
        this.children = children;
    }

    public addChild = (child: ChildBag): void => {
        this.children.push(child);
    }
}

class BagParser {


    constructor () {}

    public getBagTracker = (bagSpecsArr: Array<string>): BagTracker => {
        const tracker: BagTracker = new BagTracker();
        bagSpecsArr.forEach((bagSpecs: string) => this.createBag(bagSpecs, tracker));
        return tracker;
    }

    public createBag = (bagSpecs: string, tracker: BagTracker): void => {
        if (!bagSpecs.length) return;
        const splitSpecs: Array<string> = bagSpecs.split(' bags contain ');
        const color: string = splitSpecs[0];
        const childSpecsArr: Array<string> = splitSpecs[1].split(', ');
        const childBags: Array<ChildBag> = [];
        if (childSpecsArr[0] !== 'no other bags.') {
            childSpecsArr.forEach((childSpecs: string, i: number) => {
                const amtStr: string = childSpecs.split(' ')[0];
                const amt: number = parseInt(amtStr);
                // console.log('color: ' + color + ', amt: ' + amt);
                const remainder: string = childSpecs.substring(amtStr.length + 1);
                const splitRemainder: Array<string> = remainder.split(' ');
                const lastWord: string = splitRemainder[splitRemainder.length - 1];
                const childColor: string = remainder.substring(0, remainder.length - lastWord.length).trimStart().trimEnd();
                let child: Bag;
                if (!tracker.hasBag(childColor)) {
                    child = new Bag(childColor);
                    tracker.addBag(child);
                } else {
                    child = tracker.getBagByColor(childColor)!;
                }
                childBags.push({ amt: amt, bag: child })
                
            });
        }
        if (!tracker.hasBag(color)) {
            tracker.addBag(new Bag(color, childBags));
        } else {
            tracker.updateChildren(color, childBags);
        }
    }
}

class BagTracker {

    private readonly bags: Array<Bag> = [];

    constructor () {}

    public printBags = (): void => {
        console.log(this.bags);
    }

    public updateChildren = (color: string, children: Array<ChildBag>): void => {
        const bagIdx: number = this._getBagIdx(color);
        if (bagIdx >= 0) {
            this.bags[bagIdx].setChildren(children);
        }
    }

    public countChildBags = (color: string): number => {
        const bagIdx: number = this._getBagIdx(color);
        if (bagIdx < 0) return -1
        const bag: Bag = this.bags[bagIdx];
        let numChildren: number = 0;
        bag.getChildren().forEach((child: ChildBag) => {
            console.log(child.amt + ' ' + child.bag.getColor() + ' children of ' + color);
            numChildren += child.amt + (child.amt * this.countChildBags(child.bag.getColor()));
        });
        return numChildren
    }

    public hasBag = (color: string): boolean => {
        return this._getBagIdx(color) >= 0;
    }

    public addBag = (bag: Bag): void => {
        this.bags.push(bag);
    }

    public getParentsOfColor = (color: string): Array<string> => {
        const parents: Array<string> = [];
        this.bags.forEach((b: Bag) => {
            if (this._bagHoldsColor(b, color)) parents.push(b.getColor())
        });
        return parents;
    }

    public getBagByColor = (color: string): Bag | undefined => {
        const bagIdx: number = this._getBagIdx(color);
        return bagIdx >= 0 ? this.bags[bagIdx] : undefined;
    }

    private readonly _getBagIdx = (color: string): number => {
        return this.bags.findIndex((b: Bag) => b.isColor(color));
    }

    private readonly _bagHoldsColor = (bag: Bag, color: string): boolean => {
        return bag.hasChild(color) || bag.getChildren().findIndex((a: ChildBag) => this._bagHoldsColor(a.bag, color)) >= 0;
    }
}

const parser: BagParser = new BagParser();
const tracker: BagTracker = parser.getBagTracker(entries);
console.log(tracker.countChildBags('shiny gold'));
