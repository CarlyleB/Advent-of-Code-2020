import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n\n');

interface Passport {
    byr: number;
    iyr: number;
    eyr: number;
    hgt: string;
    hcl: string;
    ecl: string;
    pid: string;
}

const REQ_FIELDS: Array<string> = [
    'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'
]
const EYE_COLORS: Array<string> = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const isValidBirthYear = (byr: number): boolean => byr >= 1920 && byr <= 2002;
const isValidIssueYear = (iyr: number): boolean => iyr >= 2010 && iyr <= 2020;
const isValidExpirationYear = (eyr: number): boolean => eyr >= 2020 && eyr <= 2030;
const isValidHeight = (hgt: string): boolean => {
    const val: number = parseInt(hgt.substring(0, hgt.length - 2));
    const unit: string = hgt.substring(hgt.length - 2);
    if (unit === 'cm') return val >= 150 && val <= 193;
    else if (unit === 'in') return val >= 59 && val <= 76;
    return false;
}
const isValidHairColor = (hcl: string): boolean => {
    if (hcl.length !== 7 || hcl.charAt(0) !== '#') return false;
    for (let i: number = 1; i < hcl.length; i++) {
        const charCode: number = hcl.charCodeAt(i);
        if (charCode < 48 || (charCode > 57 && charCode < 97) || charCode > 102) return false;
    }
    return true;
}
const isValidEyeColor = (ecl: string) => {
    return EYE_COLORS.findIndex((x: string) => x === ecl) >= 0;
}
const isValidPassportId = (pid: string) => {
    if (pid.length !== 9) return false;
    for (let i: number = 0; i < pid.length; i++) {
        const charCode: number = pid.charCodeAt(i);
        if (charCode < 48 || charCode > 57) return false;
    }
    return true;
}

const isValidPassport = (p?: Passport): boolean => {
    return p !== undefined && isValidBirthYear(p.byr) && isValidIssueYear(p.iyr) && isValidExpirationYear(p.eyr) &&
        isValidHeight(p.hgt) && isValidHairColor(p.hcl) && isValidEyeColor(p.ecl) && isValidPassportId(p.pid);
}

const hasAllRequiredFields = (passport: string): boolean => {
    const missingField: string | undefined = REQ_FIELDS.find((field: string) => !passport.includes(field + ':'));
    return !missingField ;
}

const strToPassport = (str: string): Passport | undefined => {
    if (!hasAllRequiredFields(str)) return undefined;
    const pairs: Array<string> = str.replace(/\n/g, ' ').split(' ');
    let passport: Partial<Passport> = {};
    pairs.forEach((pair: string) => {
        const splitPair: Array<string> = pair.split(':');
        const key: string = splitPair[0];
        let val: string | number = splitPair[1];
        if (key === 'byr' || key === 'iyr' || key === 'eyr') val = parseInt(val);
        (passport[key as keyof Passport] as string | number) = val;
    });
    return passport as Passport;
}

const countValidPassports = (passports: Array<string>): number => {
    return passports.map(strToPassport).filter(isValidPassport).length;
}

console.log(countValidPassports(entries));
