import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

const NUM_ROWS: number = 128;

const getPlaneRow = (code: string): number => {
    let minRow: number = 0;
    let maxRow: number = 127;
    for (let i = 0; i < 7; i++) {
        const char: string = code[i];
        const midPoint: number = (maxRow - minRow + 1) / 2;
        if (char === 'F') {
            maxRow = minRow + midPoint - 1;
        } else if (char === 'B') {
            minRow = minRow + midPoint;
        }
    }
    if (maxRow !== minRow){
        console.log(code);
        console.log('minRow: ' + minRow + ', maxRow: ' + maxRow);
    }
    return maxRow;
}

const getPlaneColumn = (code: string): number => {
    let minRow: number = 0;
    let maxRow: number = 7;
    for (let i = 0; i < 3; i++) {
        const char: string = code[i];
        const midPoint: number = (maxRow - minRow + 1) / 2;
        if (char === 'L') {
            maxRow = minRow + midPoint - 1;
        } else if (char === 'R') {
            minRow = minRow + midPoint;
        }
    }
    // console.log('minRow: ' + minRow + ', maxRow: ' + maxRow);
    return maxRow;
}

const getSeatId = (code: string): number => {
    return (getPlaneRow(code.substring(0, 7))) * 8 + getPlaneColumn(code.substring(7));
}

const getMySeatId = (codes: Array<string>): number => {
    let maxId: number = -1;
    const seatIds: Array<number> = [];
    codes.forEach((code: string) => {
        if (code.length === 10) {
            const seatId: number = getSeatId(code);
            seatIds.push(seatId);
            if (seatId > maxId) maxId = seatId;
        }
    });
    let prevPrevFound, prevFound: boolean = false;
    for (let i = 0; i < maxId; i++) {
        const foundId = (seatIds.findIndex((id: number) => id === i) >= 0);
        if (prevPrevFound && !prevFound && foundId) return i - 1;
        prevPrevFound = prevFound;
        prevFound = foundId;
    }
    return -1;;
}


// console.log('id: ' + getSeatId('BBFFBBFRLL'));
console.log(getMySeatId(entries));
