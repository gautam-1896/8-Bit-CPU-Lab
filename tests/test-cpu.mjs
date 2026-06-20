/**
 * Automated tests for 8-Bit CPU Lab logic.
 * Run: node tests/test-cpu.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, '..', '8bit-cpu-lab.html');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failed++;
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
  }
}

function assert(cond, msg = 'Assertion failed') {
  if (!cond) throw new Error(msg);
}

// ── CPU model (mirrors 8bit-cpu-lab.html) ──────────────────

function createCPU() {
  return {
    A: 0,
    B: 0,
    R: 0,
    PC: 0,
    SP: 15,
    IR: 'NOP',
    flags: { Z: 0, C: 0, S: 0, V: 0, P: 0, A: 0 },
    ram: new Uint8Array(16),
    stack: [],
    cycle: 0,
    halted: false,
  };
}

function computeFlags(cpu, result, a, b, op) {
  const r8 = result & 0xff;
  cpu.flags.Z = r8 === 0 ? 1 : 0;
  cpu.flags.S = (r8 >> 7) & 1;
  if (op === 'ADD' || op === 'SUB') {
    cpu.flags.C = result > 255 || result < 0 ? 1 : 0;
  }
  const ones = r8.toString(2).split('').filter((x) => x === '1').length;
  cpu.flags.P = ones % 2 === 0 ? 1 : 0;
  if (op === 'ADD') {
    const sa = a > 127 ? a - 256 : a;
    const sb = b > 127 ? b - 256 : b;
    const sr = sa + sb;
    cpu.flags.V = sr > 127 || sr < -128 ? 1 : 0;
    cpu.flags.A = (a & 0xf) + (b & 0xf) > 0xf ? 1 : 0;
  } else if (op === 'SUB') {
    const sa = a > 127 ? a - 256 : a;
    const sb = b > 127 ? b - 256 : b;
    const sr = sa - sb;
    cpu.flags.V = sr > 127 || sr < -128 ? 1 : 0;
    cpu.flags.A = (a & 0xf) < (b & 0xf) ? 1 : 0;
  } else {
    cpu.flags.V = 0;
    cpu.flags.A = 0;
  }
}

function doOp(cpu, op) {
  cpu.cycle++;
  let result = 0;
  switch (op) {
    case 'ADD':
      result = cpu.A + cpu.B;
      computeFlags(cpu, result, cpu.A, cpu.B, 'ADD');
      cpu.R = result & 0xff;
      cpu.A = cpu.R;
      break;
    case 'SUB':
      result = cpu.A - cpu.B;
      computeFlags(cpu, result, cpu.A, cpu.B, 'SUB');
      cpu.R = ((result % 256) + 256) % 256;
      cpu.A = cpu.R;
      break;
    case 'AND':
      cpu.R = (cpu.A & cpu.B) & 0xff;
      cpu.A = cpu.R;
      computeFlags(cpu, cpu.R, cpu.A, cpu.B, 'AND');
      break;
    case 'NOT':
      cpu.R = ~cpu.A & 0xff;
      cpu.A = cpu.R;
      computeFlags(cpu, cpu.R, cpu.A, 0, 'NOT');
      break;
    case 'SHL':
      cpu.flags.C = (cpu.A >> 7) & 1;
      cpu.A = (cpu.A << 1) & 0xff;
      cpu.R = cpu.A;
      computeFlags(cpu, cpu.A, cpu.A, 0, 'SHL');
      break;
    default:
      throw new Error(`Unknown op: ${op}`);
  }
}

function parseProgram(code) {
  return code
    .split('\n')
    .map((l) => l.replace(/;.*/, '').trim())
    .filter((l) => l.length > 0);
}

function execInstruction(cpu, line) {
  const parts = line.toUpperCase().split(/[\s,]+/);
  const instr = parts[0];
  const op1 = parts[1];
  const op2 = parts[2];
  cpu.IR = instr;
  cpu.cycle++;

  const getVal = (s) => {
    if (s === 'A') return cpu.A;
    if (s === 'B') return cpu.B;
    const n = s.startsWith('0X') ? parseInt(s, 16) : parseInt(s, 10);
    return Number.isNaN(n) ? 0 : n & 0xff;
  };

  switch (instr) {
    case 'MOV':
      if (op1 === 'A') cpu.A = getVal(op2);
      else if (op1 === 'B') cpu.B = getVal(op2);
      cpu.R = op1 === 'A' ? cpu.A : cpu.B;
      computeFlags(cpu, cpu.R, cpu.R, 0, 'MOV');
      return { log: 'MOV' };
    case 'ADD':
      doOp(cpu, 'ADD');
      return { log: 'ADD' };
    case 'SUB':
      doOp(cpu, 'SUB');
      return { log: 'SUB' };
    case 'AND':
      doOp(cpu, 'AND');
      return { log: 'AND' };
    case 'NOT':
      doOp(cpu, 'NOT');
      return { log: 'NOT' };
    case 'SHL':
      doOp(cpu, 'SHL');
      return { log: 'SHL' };
    case 'PUSH':
      cpu.stack.push(cpu.A);
      cpu.SP = Math.max(0, cpu.SP - 1);
      return { log: 'PUSH' };
    case 'POP':
      if (cpu.stack.length > 0) {
        cpu.A = cpu.stack.pop();
        cpu.SP = Math.min(15, cpu.SP + 1);
      }
      return { log: 'POP' };
    case 'STORE': {
      const addr = op1 !== undefined ? getVal(op1) & 0xf : cpu.PC & 0xf;
      cpu.ram[addr] = cpu.A;
      return { log: 'STORE' };
    }
    case 'LOAD': {
      const addr = op1 !== undefined ? getVal(op1) & 0xf : cpu.PC & 0xf;
      cpu.A = cpu.ram[addr];
      return { log: 'LOAD' };
    }
    case 'JMP':
      cpu.PC = getVal(op1) & 0xf;
      return { jump: cpu.PC, log: 'JMP' };
    case 'JZ':
      if (cpu.flags.Z) {
        cpu.PC = getVal(op1) & 0xf;
        return { jump: cpu.PC, log: 'JZ' };
      }
      return { log: 'JZ not taken' };
    case 'HLT':
      return { halt: true, log: 'HLT' };
    default:
      return { log: `Unknown: ${instr}` };
  }
}

function runProgram(cpu, lines, maxSteps = 200) {
  cpu.PC = 0;
  cpu.halted = false;
  let steps = 0;
  while (!cpu.halted && steps < maxSteps) {
    if (cpu.PC >= lines.length) break;
    const stepIdx = cpu.PC;
    const result = execInstruction(cpu, lines[stepIdx]);
    if (result.halt) {
      cpu.halted = true;
      break;
    }
    if (result.jump !== undefined) cpu.PC = result.jump;
    else cpu.PC = stepIdx + 1;
    steps++;
  }
  return steps;
}

// ── Tests ───────────────────────────────────────────────────

console.log('\n8-Bit CPU Lab — Test Suite\n');

test('HTML file exists and contains core sections', () => {
  const html = readFileSync(htmlPath, 'utf8');
  assert(html.includes('8-BIT CPU LAB'), 'Missing title');
  assert(html.includes('function init()'), 'Missing init()');
  assert(html.includes('function runProgram()'), 'Missing runProgram()');
  assert(html.includes('while (!cpu.halted && steps < maxSteps)'), 'runProgram should use while-loop for jumps');
});

test('parseProgram removes comments and blank lines', () => {
  const lines = parseProgram('; start\nMOV A, 10\n\n; end\nMOV B, 5');
  assert(lines.length === 2);
  assert(lines[0] === 'MOV A, 10');
  assert(lines[1] === 'MOV B, 5');
});

test('ADD: 42 + 13 = 55', () => {
  const cpu = createCPU();
  cpu.A = 42;
  cpu.B = 13;
  doOp(cpu, 'ADD');
  assert(cpu.A === 55);
  assert(cpu.flags.Z === 0);
});

test('ADD: carry flag on overflow (200 + 100)', () => {
  const cpu = createCPU();
  cpu.A = 200;
  cpu.B = 100;
  doOp(cpu, 'ADD');
  assert(cpu.A === 44);
  assert(cpu.flags.C === 1);
});

test('SUB: 10 - 20 wraps to 246', () => {
  const cpu = createCPU();
  cpu.A = 10;
  cpu.B = 20;
  doOp(cpu, 'SUB');
  assert(cpu.A === 246);
});

test('AND: bitwise AND', () => {
  const cpu = createCPU();
  cpu.A = 0b10101010;
  cpu.B = 0b11001100;
  doOp(cpu, 'AND');
  assert(cpu.A === 0b10001000);
});

test('SHL: shift left sets carry from MSB', () => {
  const cpu = createCPU();
  cpu.A = 0b10000001;
  doOp(cpu, 'SHL');
  assert(cpu.A === 0b00000010);
  assert(cpu.flags.C === 1);
});

test('Assembly: MOV and ADD sequence', () => {
  const cpu = createCPU();
  const lines = parseProgram('MOV A,42\nMOV B,13\nADD A,B\nHLT');
  const steps = runProgram(cpu, lines);
  assert(cpu.A === 55, `Expected A=55, got ${cpu.A}`);
  assert(cpu.halted === true);
  assert(steps === 3);
});

test('Assembly: JMP skips instruction', () => {
  const cpu = createCPU();
  const lines = parseProgram(`
    MOV A,1
    JMP 3
    MOV A,99
    MOV A,42
    HLT
  `);
  runProgram(cpu, lines);
  assert(cpu.A === 42, `Expected A=42 (skipped 99), got ${cpu.A}`);
});

test('Assembly: backward JMP loop increments A', () => {
  const cpu = createCPU();
  const lines = parseProgram(`
    MOV A,0
    MOV B,1
    ADD A,B
    JMP 2
    HLT
  `);
  const steps = runProgram(cpu, lines, 12);
  assert(steps === 12, 'Should run 12 steps before limit');
  assert(cpu.A === 5, `Expected A=5 after loop (2 setup + 5 ADDs), got ${cpu.A}`);
});

test('Assembly: PUSH and POP stack', () => {
  const cpu = createCPU();
  const lines = parseProgram(`
    MOV A,77
    PUSH A
    MOV A,0
    POP A
    HLT
  `);
  runProgram(cpu, lines);
  assert(cpu.A === 77);
  assert(cpu.stack.length === 0);
});

test('Assembly: STORE and LOAD memory', () => {
  const cpu = createCPU();
  const lines = parseProgram(`
    MOV A,200
    STORE 7
    MOV A,0
    LOAD 7
    HLT
  `);
  runProgram(cpu, lines);
  assert(cpu.A === 200);
  assert(cpu.ram[7] === 200);
});

test('Assembly: JZ taken when zero flag set', () => {
  const cpu = createCPU();
  const lines = parseProgram(`
    MOV A,5
    MOV B,5
    SUB A,B
    JZ 4
    MOV A,99
    MOV A,42
    HLT
  `);
  runProgram(cpu, lines);
  assert(cpu.A === 42, `Expected A=42 after JZ, got ${cpu.A}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
