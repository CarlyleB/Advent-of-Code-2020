import { readFileSync } from 'fs';

const file = readFileSync(process.argv[2], 'utf-8');
const entries: Array<string> = file.split('\n');

type InstructionCommand = 'acc' | 'jmp' | 'nop';
type InstructionSign = '+' | '-';

interface Instruction {
    command: InstructionCommand;
    sign: InstructionSign;
    amount: number;
    hasExecuted: boolean;
}

class Interpreter {

    private accumulator: number = 0;
    private pointer: number = 0;

    constructor (private readonly instructions: Array<Instruction>) {}

    public execInstructions = (): number => {
        while (this.instructions[this.pointer].hasExecuted === false) {
            this.execNextInstruction();
        }
        return this.accumulator;
    }

    private execNextInstruction = (): void => {
        const instruction: Instruction = this.instructions[this.pointer];
        this.instructions[this.pointer].hasExecuted = true;
        if (instruction.command === 'acc') this.acc(instruction.sign, instruction.amount);
        else if (instruction.command === 'jmp') this.jmp(instruction.sign, instruction.amount);
        else if (instruction.command === 'nop') this.nop();
    }

    private acc = (sign: string, amt: number): void => {
        if (this.isPositive(sign)) {
            this.accumulator += amt;
        } else {
            this.accumulator -= amt;
        }
        this.pointer++;
    }

    private jmp = (sign: string, amt: number): void => {
        if (this.isPositive(sign)) {
            this.pointer += amt;
        } else {
            this.pointer -= amt;
        }
    }

    private nop = (): void => {
        this.pointer++;
    }

    private isPositive = (sign: string): boolean => {
        return sign === '+';
    }
}

const getInstructions = (vals: Array<string>): Array<Instruction> => {
    const instructions: Array<Instruction> = [];
    vals.forEach((val: string) => {
        if (val.length) {
            const splitVal: Array<string> = val.split(' ');
            instructions.push({
                command: splitVal[0] as InstructionCommand,
                sign: splitVal[1][0] as InstructionSign, 
                amount: parseInt(splitVal[1].substring(1)),
                hasExecuted: false
            });
        }
    });
    return instructions;
}

const interpreter: Interpreter = new Interpreter(getInstructions(entries));

console.log(interpreter.execInstructions());
