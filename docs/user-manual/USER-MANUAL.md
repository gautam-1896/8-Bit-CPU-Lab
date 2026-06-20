# 8-Bit CPU Lab — User Manual

Welcome to the **8-Bit CPU Lab** user manual. This guide explains every part of the simulator so you can use it confidently — whether you are in a classroom, studying alone, or demoing computer architecture concepts.

---

## Table of Contents

1. [Overview](#overview)
2. [Interface Layout](#interface-layout)
3. [Quick Tutorial (5 Minutes)](#quick-tutorial-5-minutes)
4. [Manual Sections](#manual-sections)
5. [Support & Limits](#support--limits)

---

## Overview

The 8-Bit CPU Lab simulates a simplified processor with:

- Two general-purpose registers (**A** and **B**)
- An accumulator / result register (**ACC**)
- Six status **flags**
- A 16-byte **RAM**
- A **stack** for PUSH/POP
- A small **assembly language** with about 20 instructions

Everything runs in your web browser. No installation is required beyond a modern browser (and optionally Node.js if you want to run tests or a local server).

---

## Interface Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER — Title, version, cycle counter, clock speed            │
├──────────────┬──────────────────────────────┬───────────────────┤
│ LEFT PANEL   │ CENTER PANEL                 │ RIGHT PANEL       │
│              │                              │                   │
│ • Reg A,B,R  │ • Bit editor (BIN/DEC/HEX)   │ • RAM grid (16)   │
│ • Bit toggles│ • ALU animation canvas       │ • PC, IR, SP, MAR │
│ • Flags      │ • Operation buttons          │ • Stack view      │
│ • Edit target│ • Fetch-Decode-Execute       │ • Instruction list│
│              │ • Clock speed slider         │                   │
├──────────────┴──────────────────────────────┴───────────────────┤
│ BOTTOM — Assembly editor, RUN / STEP / CLR / EXAMPLE, exec log  │
└─────────────────────────────────────────────────────────────────┘
```

### Left Panel — Registers & Flags

- **Register A / B** — Click any bit (7 down to 0) to toggle it. Bit 7 is the most significant (sign bit in signed mode).
- **Result (ACC)** — Read-only; shows the output of the last ALU operation.
- **UNSIGNED / SIGNED** — Changes how decimal values are displayed (does not change stored bits).
- **Flags** — Light up when active:
  - **Z** — Result is zero
  - **C** — Carry (add/sub overflow or shift-out bit)
  - **S** — Sign bit set (bit 7)
  - **V** — Signed overflow (ADD/SUB only)
  - **P** — Even parity (even number of 1-bits in result)
  - **A** — Auxiliary carry (nibble boundary, ADD/SUB)

### Center Panel — ALU & Operations

- **Bit Editor** — Type values in binary, decimal, hex, or octal. Edits apply to the selected register (A or B).
- **ALU Canvas** — Live diagram of data flowing from A and B through the ALU to the result.
- **Operation Buttons** — Immediate ALU ops (same as many assembly instructions).
- **Instruction Cycle** — FETCH → DECODE → EXECUTE lights animate when an operation runs.
- **Clock Speed** — Controls delay between steps when running an assembly program. **AUTO** toggles a free-running cycle counter (visual only).

### Right Panel — Memory & CPU Internals

- **RAM** — 16 cells (0x00–0x0F). Click a cell to enter a new value (decimal or `0x` hex).
  - **Amber border** — Program counter location during RUN
  - **Magenta border** — Stack pointer location
- **PC** — Program Counter: index of the current assembly line (0-based internally)
- **IR** — Instruction Register: mnemonic of the last executed instruction
- **SP** — Stack Pointer: starts at 0x0F, moves down on PUSH
- **MAR** — Memory Address Register (displays current PC for visualization)

### Bottom Panel — Assembly Simulator

- Write one instruction per line
- Lines starting with `;` are comments
- **RUN** — Reset CPU, execute up to 200 steps with animation
- **STEP** — Execute one instruction at a time
- **CLR** — Clear the execution log
- **EXAMPLE** — Load a sample program

---

## Quick Tutorial (5 Minutes)

### Step 1 — Set registers manually

1. Click **REG A** in the left panel (if not already selected).
2. In the center panel, type `42` in the **DEC** field.
3. Select **REG B** and type `13` in **DEC**.
4. Press **ADD A+B** — Result should show **55** (0x37).

### Step 2 — Watch flags

1. Press **CLR ALL** (clears registers, RAM, stack, and flags).
2. Set A = `255`, B = `1`, press **ADD A+B**.
3. Result wraps to **0** — watch **Z** and **C** flags activate.

### Step 3 — Run assembly

1. Click **EXAMPLE** or paste:

```asm
MOV A,42
MOV B,13
ADD A,B
HLT
```

2. Press **RUN**.
3. Read the **Execution Log** on the right — each line shows fetch, operation, and result.

### Step 4 — Step through code

1. Load a program and press **STEP** repeatedly instead of RUN.
2. Watch **PC** and the FDE stages update one instruction at a time.

---

## Manual Sections

Detailed guides are split into separate documents:

| Document | Contents |
|----------|----------|
| [Getting Started](GETTING-STARTED.md) | Installation, first launch, learning path |
| [Instruction Reference](INSTRUCTION-REFERENCE.md) | Full opcode list with examples |
| [Troubleshooting](TROUBLESHOOTING.md) | FAQ, limits, known behavior |

---

## Support & Limits

| Topic | Detail |
|-------|--------|
| Program length | Unlimited lines in editor; RUN executes max **200 steps** |
| Addresses | RAM and jumps use **4-bit addresses** (0–15) |
| Registers in assembly | Only **A** and **B** (no direct memory-to-memory MOV) |
| Case | Instructions are **case-insensitive** (`mov a,5` = `MOV A,5`) |
| Separators | Operands separated by space or comma: `MOV A, 42` or `MOV A 42` |

For technical validation, run `npm test` from the project folder (requires Node.js).

---

*8-Bit CPU Lab v5.0 — Interactive Processor Simulator*
