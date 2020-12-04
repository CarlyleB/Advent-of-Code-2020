import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

interface PasswordPolicy {
    min: number;
    max: number;
    letter: string;
}

/**
 * Counts the number of times the letter specified by the policy occurs in the given password,
 * and returns true if it is within the policy's bounds.
 */
const isPasswordValid = (policy: PasswordPolicy, password: string): boolean => {
    const count: number = password.split('').filter((x) => x === policy.letter).length;
    return count >= policy.min && count <= policy.max;
}

/**
 * Creates PasswordPolicy object from a string in the format "<min>-<max> <letter>"
 */
const parsePolicy = (line: string): PasswordPolicy => {
    const splitBySpace: Array<string> = line.split(' ');
    const limits: Array<string> = splitBySpace[0].split('-');
    return {
        min: parseInt(limits[0]),
        max: parseInt(limits[1]),
        letter: splitBySpace[1]
    };
}

/**
 * Returns the number of valid passwords.
 */
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
