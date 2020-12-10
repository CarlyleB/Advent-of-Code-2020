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

class Fixer {
    private runner: Runner;

    constructor (private readonly instructions: Array<Instruction>) {
        this.runner = new Runner(instructions);
    }

    public fixInstructions = (): number => {
        let toSwitch: number = -1;
        let acc: number = -1;
        let count = 0;
        while (acc < 0) {
            toSwitch = this._findNextSwitch(toSwitch);
            this._switchAtIdx(toSwitch);
            //console.log('SWITCHING ' + toSwitch);
            this.runner = new Runner(this.instructions);
            acc = this.runner.execInstructions();
            //console.log(acc);
            count++;
            this._resetInstructions(toSwitch);
        }
        return acc;
    }

    private _switchAtIdx = (idx: number) => {
        const origCommand: string = this.instructions[idx].command;
        if (this.instructions[idx].command === 'jmp') this.instructions[idx].command = 'nop';
        else if (this.instructions[idx].command === 'nop') this.instructions[idx].command = 'jmp';
        console.log('switched command ' + idx + ' from ' + origCommand + ' to ' + this.instructions[idx].command);
    }

    private _findNextSwitch = (lastSwitch: number): number => {
        if (lastSwitch >= 0) console.log('command at idx ' + lastSwitch + ' is ' + this.instructions[lastSwitch].command);
        const nextSwitch: number = this.instructions.findIndex((x: Instruction, idx: number) => {
            //console.log('idx: ' + idx + ', lastSwitch: ' + lastSwitch);
            return idx > lastSwitch && (x.command === 'jmp' || x.command === 'nop');
        });
       // console.log('next switch: ' + nextSwitch);
        return nextSwitch;
    }

    private _resetInstructions = (lastSwitch: number): void => {
        console.log('resetting');
        this._switchAtIdx(lastSwitch);
        this.instructions.forEach((instruction: Instruction) => instruction.hasExecuted = false);
    }
}
class Runner {

    private accumulator: number = 0;
    private pointer: number = 0;

    constructor (private readonly instructions: Array<Instruction>) {}

    public execInstructions = (): number => {
        while (this.pointer < this.instructions.length && !this.instructions[this.pointer].hasExecuted) {
            this.execNextInstruction();
        }
        //if (this.instructions[this.pointer].hasExecuted) console.log('has executed');
        return this.pointer >= this.instructions.length ? this.accumulator : -1;
    }

    private execNextInstruction = (): void => {
        const instruction: Instruction = this.instructions[this.pointer];
        //console.log(instruction);
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

const fixer: Fixer = new Fixer(getInstructions(entries));

console.log(fixer.fixInstructions());
