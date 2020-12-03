import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

interface PasswordPolicy {
    idxA: number;
    idxB: number;
    letter: string;
}

const isPasswordValid = (policy: PasswordPolicy, password: string): boolean => {
    const passwordLetters: Array<string> = password.split('');
    const idxAMatch: boolean = passwordLetters[policy.idxA] === policy.letter;
    const idxBMatch: boolean = passwordLetters[policy.idxB] === policy.letter;
    return (idxAMatch && !idxBMatch) || (idxBMatch && !idxAMatch);
}

const parsePolicy = (line: string): PasswordPolicy => {
    const splitBySpace: Array<string> = line.split(' ');
    const limits: Array<string> = splitBySpace[0].split('-');
    return {
        idxA: parseInt(limits[0]) - 1,
        idxB: parseInt(limits[1]) - 1,
        letter: splitBySpace[1]
    };
}

const evalPasswords = (passwords: Array<string>): number => {
    return passwords.filter((x) => {
        const passwordAndPolicy: Array<string> = x.split(': ');
        if (passwordAndPolicy.length === 2) {
            return isPasswordValid(parsePolicy(passwordAndPolicy[0]), passwordAndPolicy[1]);
        }
        return false;
    }).length;
}

console.log(evalPasswords(entries));
