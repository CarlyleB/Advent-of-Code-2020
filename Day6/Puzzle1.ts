import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const groups: Array<string> = file.split('\n\n');

const countAnswers = (codes: Array<number>): number => {
    let count: number = 0;
    for (let i: number = 97; i <= 122; i++) {
        if (codes.findIndex((x) => x === i) >= 0) count++;
    }
    return count;
}

const getAnswerCodes = (answers: string): Array<number> => {
    const splitAnswers: Array<string> = answers.split('\n');
    const codes: Array<number> = [];
    splitAnswers.forEach((a: string) => {
        for (let i: number = 0; i < a.length; i++) {
            const code: number = a.charCodeAt(i);
            if (codes.findIndex((c) => c === code) === -1) {
                codes.push(a.charCodeAt(i));
            }
        }
    });
    return codes;
}

const countAllAnswers = (questions: Array<string>): number => {
    let count: number = 0;
    questions.map(getAnswerCodes).forEach((c: Array<number>) => count += countAnswers(c));
    return count;
}

console.log(countAllAnswers(groups));
