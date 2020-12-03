import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

interface PasswordPolicy {
    min: number;
    max: number;
    letter: string;
}

const isPasswordValid = (policy: PasswordPolicy, password: string): boolean => {
    const count: number = password.split('').filter((x) => x === policy.letter).length;
    return count >= policy.min && count <= policy.max;
}

const parsePolicy = (line: string): PasswordPolicy => {
    const splitBySpace: Array<string> = line.split(' ');
    const limits: Array<string> = splitBySpace[0].split('-');
    return {
        min: parseInt(limits[0]),
        max: parseInt(limits[1]),
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
