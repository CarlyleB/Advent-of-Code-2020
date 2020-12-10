import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const groups: Array<string> = file.split('\n\n');

const countAnswers = (codes: Array<Array<number>>): number => {
    const filtered: Array<number> = codes[0].filter((a: number) => {
        for (let i: number = 1; i < codes.length; i++) {
            if (codes[i].findIndex((x) => x === a) === -1) return false;
        }
        return true;
    });
    return filtered.length;
}
    
const getAnswerCodesPerPerson = (answers: string): Array<Array<number>> => {
    const splitAnswers: Array<string> = answers.split('\n');
    const codes: Array<Array<number>> = [];
    splitAnswers.forEach((a: string) => {
        if (a.length > 0) {
            const personCodes: Array<number> = [];
            for (let i: number = 0; i < a.length; i++) {
                personCodes.push(a.charCodeAt(i));
            }
            codes.push(personCodes);
        }
    })
    return codes;
}

const countAllAnswers = (questions: Array<string>): number => {
    let count: number = 0;
    questions.map(getAnswerCodesPerPerson).forEach((c: Array<Array<number>>) => count += countAnswers(c));
    return count;
}

console.log(countAllAnswers(groups));