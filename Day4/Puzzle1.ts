import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n\n');

const REQ_FIELDS: Array<string> = [
    'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'
]

const isValidPassport = (passport: string): boolean => {
    const missingField: string | undefined = REQ_FIELDS.find((field: string) => !passport.includes(field + ':'));
    return !missingField ;
}

const countValidPassports = (passports: Array<string>): number => {
    return passports.filter(isValidPassport).length;
}

console.log(countValidPassports(entries));