# Instruction Reference

Complete reference for the **8-Bit CPU Lab** assembly language and ALU operations.

---

## Syntax Rules

```
INSTRUCTION [operand1] [, operand2]
```

- **One instruction per line**
- **Comments** start with `;` and run to end of line
- **Case insensitive:** `mov a,5` equals `MOV A,5`
- **Operands** separated by spaces and/or commas
- **Numbers:** decimal (`42`), hex (`0x2A`), or register names (`A`, `B`)
- **Addresses:** 0–15 (4-bit), used by JMP, STORE, LOAD

---

## Data Movement

### MOV — Move immediate or register value

```
MOV A, n     ; A = n (0–255) or A = B
MOV B, n     ; B = n (0–255) or B = A
```

| Example | Effect |
|---------|--------|
| `MOV A,42` | A = 42 |
| `MOV B,0xFF` | B = 255 |
| `MOV A,B` | A = current value of B |
| `MOV B,A` | B = current value of A |

**Flags:** Z, S, P updated from destination value; V and A cleared.

---

## Arithmetic

### ADD — Add B to A

```
ADD A,B      ; A = (A + B) mod 256
```

| Example | A before | B | A after | Notes |
|---------|----------|---|---------|-------|
| `ADD A,B` | 42 | 13 | 55 | — |
| `ADD A,B` | 200 | 100 | 44 | C=1 (carry) |

**Flags:** Z, C, S, V, P, A (aux carry on nibble overflow).

### SUB — Subtract B from A

```
SUB A,B      ; A = (A - B) mod 256
```

| Example | A before | B | A after |
|---------|----------|---|---------|
| `SUB A,B` | 50 | 20 | 30 |
| `SUB A,B` | 10 | 20 | 246 | (wraps) |

**Flags:** Same as ADD (signed overflow logic for V).

---

## Logic

### AND — Bitwise AND

```
AND A,B      ; A = A & B
```

### OR — Bitwise OR

```
OR A,B       ; A = A | B
```

### XOR — Bitwise exclusive OR

```
XOR A,B      ; A = A ^ B
```

### NOT — Bitwise complement

```
NOT A        ; A = ~A & 0xFF
```

**Flags:** Z, S, P updated; C, V, A cleared (except shift ops).

---

## Shifts & Rotates

### SHL — Shift left

```
SHL A        ; MSB → C flag, A = A << 1
```

Example: A = `0b10000001` → A = `0b00000010`, C = 1

### SHR — Shift right (logical)

```
SHR A        ; LSB → C flag, A = A >> 1
```

### ROL — Rotate left

```
ROL A        ; MSB wraps to LSB
```

### ROR — Rotate right

```
ROR A        ; LSB wraps to MSB
```

**Note:** For SHL/SHR, the **C flag holds the bit shifted out**, not arithmetic carry.

---

## Stack

### PUSH — Push A onto stack

```
PUSH A       ; stack.push(A), SP decrements (min 0)
```

### POP — Pop into A

```
POP A        ; A = stack.pop(), SP increments (max 15)
```

| Situation | Behavior |
|-----------|----------|
| POP on empty stack | Logs "Stack underflow!", A unchanged |

---

## Memory

### STORE — Write A to RAM

```
STORE n      ; RAM[n] = A     (n = 0–15)
```

### LOAD — Read RAM into A

```
LOAD n       ; A = RAM[n]     (n = 0–15)
```

You can also click RAM cells in the UI to edit values directly.

---

## Control Flow

### JMP — Unconditional jump

```
JMP n        ; PC = n (line index, 0-based)
```

**Important:** Jump targets are **line numbers** in your program (0 = first instruction), not RAM addresses.

Example — skip line 2:

```asm
MOV A,1      ; line 0
JMP 3        ; line 1 — jump to line 3
MOV A,99     ; line 2 — skipped
MOV A,42     ; line 3
HLT          ; line 4
```

### JZ — Jump if zero flag set

```
JZ n         ; if Z==1 then PC = n
```

Use after SUB or ADD to branch when result is zero.

### JNZ — Jump if zero flag clear

```
JNZ n        ; if Z==0 then PC = n
```

---

## System

### NOP — No operation

```
NOP          ; Does nothing, advances PC
```

### HLT — Halt

```
HLT          ; Stops program execution
```

Always end programs with `HLT` during learning exercises so RUN terminates cleanly.

---

## ALU Panel Buttons (Manual Mode)

These mirror assembly instructions but execute immediately without assembly:

| Button | Same as |
|--------|---------|
| ADD A+B | ADD A,B |
| SUB A-B | SUB A,B |
| AND | AND A,B |
| OR | OR A,B |
| XOR | XOR A,B |
| NOT A | NOT A |
| SHL ≪ | SHL A |
| SHR ≫ | SHR A |
| ROL ↺ | ROL A |
| ROR ↻ | ROR A |
| SWAP A↔B | Exchange A and B |
| CLR ALL | Reset registers, RAM, stack, flags, PC |

---

## CPU Flags Reference

| Flag | Name | Set when |
|------|------|----------|
| Z | Zero | Result equals 0 |
| C | Carry | ADD/SUB overflow 8 bits; or bit shifted out (SHL/SHR) |
| S | Sign | Bit 7 of result is 1 |
| V | Overflow | Signed ADD/SUB result outside −128..127 |
| P | Parity | Even number of 1-bits in result |
| A | Aux carry | Nibble carry/borrow in ADD/SUB |

---

## Example Programs

### Hello value (store ASCII)

```asm
MOV A,72        ; 'H'
STORE 0
MOV A,73        ; 'I'
STORE 1
HLT
```

### Find maximum of A and B (simple)

```asm
; Assumes A and B already set via UI or prior MOVs
; If A >= B, keep A; else A = B
MOV B,A         ; temp compare setup — simplified lab version
; For full compare, use SUB + JNZ patterns
HLT
```

### Loop 3 times

```asm
MOV A,0
MOV B,1
ADD A,B         ; 2: increment
STORE 0
MOV A,B
MOV B,3
SUB A,B         ; check if A reached 3
JZ 7
MOV A,B
JMP 2
HLT
```

---

## Instruction Summary Table

| Instruction | Operands | Description |
|-------------|----------|-------------|
| MOV | reg, value | Load register |
| ADD | A, B | A = A + B |
| SUB | A, B | A = A − B |
| AND | A, B | A = A & B |
| OR | A, B | A = A \| B |
| XOR | A, B | A = A ^ B |
| NOT | A | A = ~A |
| SHL | A | Shift left |
| SHR | A | Shift right |
| ROL | A | Rotate left |
| ROR | A | Rotate right |
| PUSH | A | Push A to stack |
| POP | A | Pop to A |
| STORE | addr | RAM[addr] = A |
| LOAD | addr | A = RAM[addr] |
| JMP | line | Jump to line index |
| JZ | line | Jump if Z=1 |
| JNZ | line | Jump if Z=0 |
| NOP | — | No operation |
| HLT | — | Stop |

---

[← Back to User Manual](USER-MANUAL.md) | [Getting Started](GETTING-STARTED.md) | [Troubleshooting](TROUBLESHOOTING.md)
