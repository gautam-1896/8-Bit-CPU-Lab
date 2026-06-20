# Getting Started

This guide walks you through your first session with **8-Bit CPU Lab**, from opening the file to running your first assembly program.

---

## Requirements

| Requirement | Details |
|-------------|---------|
| **Browser** | Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+ |
| **Optional: Node.js** | Version 18+ for running `npm test` and `npm run serve` |
| **Screen** | 900px+ width recommended; layout adapts on smaller screens |
| **Internet** | Optional — only needed for Google Fonts (Orbitron, Share Tech Mono) |

---

## How to Open the Lab

### Method A — Direct file open

1. Navigate to the project folder.
2. Double-click **`8bit-cpu-lab.html`**.
3. Your default browser opens the simulator.

This works on all platforms. Some browsers may show `file://` in the address bar — that is normal.

### Method B — Local server (developers)

```powershell
cd "d:\Computer architecture from scratch"
npm run serve
```

Open: **http://localhost:8080/8bit-cpu-lab.html**

A local server avoids rare browser restrictions on `file://` URLs and matches how web apps are typically served.

---

## First Launch Checklist

When the page loads, you should see:

- [x] Green/cyan retro UI with scanline overlay
- [x] Register A, B, and Result showing `0` / `0x00`
- [x] Six flags (Z, C, S, V, P, A) all at `0`
- [x] 16 RAM cells labeled `00` through `0F`
- [x] Assembly textarea at the bottom with placeholder text
- [x] Execution log: *"8-Bit CPU Lab initialized."*

If the ALU canvas is blank at first, wait a second — it redraws on the animation loop.

---

## Learning Path (Suggested Order)

### Level 1 — Manual register editing (10 min)

1. Select **REG A**, enter `170` in DEC (binary `10101010`).
2. Toggle individual bits and watch BIN/HEX/OCT update.
3. Switch **UNSIGNED** ↔ **SIGNED** and compare decimal display.
4. Select **REG B**, set to `15`, click **ADD A+B**.

**Goal:** Understand that registers hold 8 bits and operations update flags.

### Level 2 — ALU operations (15 min)

Try each operation button with A = `200`, B = `50`:

| Button | Expected result | Flag to watch |
|--------|-----------------|---------------|
| ADD | 250 | — |
| SUB | 150 | S (maybe) |
| AND | 200 & 50 | Z if zero |
| OR | 200 \| 50 | — |
| XOR | 200 ^ 50 | — |
| NOT | ~200 & 0xFF | S |
| SHL | A << 1 | C (bit shifted out) |
| SHR | A >> 1 | C |

**Goal:** Connect button ops to flag behavior before writing assembly.

### Level 3 — Assembly basics (20 min)

Type this program:

```asm
; Add two numbers
MOV A,100
MOV B,23
ADD A,B
HLT
```

1. Press **RUN** — A should become `123`.
2. Press **STEP** on a fresh run to see one line at a time.
3. Change `ADD` to `SUB` and predict the result before running.

### Level 4 — Memory & stack (20 min)

```asm
MOV A,65        ; ASCII 'A'
STORE 0         ; Save to RAM[0]
MOV A,0
LOAD 0          ; A = 65 again
PUSH A
MOV A,255
POP A           ; A restored to 65
HLT
```

Watch RAM cell `00` and the stack panel update.

### Level 5 — Control flow (25 min)

```asm
; Count from 1 to 5
MOV A,0
MOV B,1
ADD A,B         ; line 2: A = A + B
STORE 1         ; save counter
MOV B,A
MOV A,5
SUB A,B         ; A = 5 - counter, sets Z when done
JZ 6            ; jump to HLT when A==0
MOV A,B         ; restore counter
JMP 2           ; loop back to ADD
HLT
```

**Goal:** Use JMP, JZ, and flags together.

---

## Built-in Example Program

Click **EXAMPLE** to load:

```asm
; Fibonacci-style demo
MOV A,1
MOV B,1
PUSH A
ADD A,B
PUSH A
MOV B,3
ADD A,B
STORE 5
SHL A
PUSH A
NOT A
AND A,B
PUSH A
HLT
```

Press **RUN** and trace each instruction in the log. Try to predict register values before each step.

---

## Clock & Animation

- **Clock Speed slider (1–10 Hz)** — Slows or speeds assembly **RUN** animation.
- **AUTO button** — Pulses the cycle counter in the header (does not execute code by itself).
- **FDE stages** — Flash during each operation to illustrate Fetch → Decode → Execute.

---

## Keyboard Shortcuts

Focus must be **outside** text inputs for shortcuts to work:

| Key | Action |
|-----|--------|
| A | ADD |
| S | SUB |
| N | NOT |
| X | XOR |
| ← / → | SHL / SHR |
| R | ROL |
| Ctrl+Enter | RUN program |

---

## Next Steps

- Read the full [Instruction Reference](INSTRUCTION-REFERENCE.md) for every opcode
- See [Troubleshooting](TROUBLESHOOTING.md) if something does not behave as expected
- Run `npm test` to verify the CPU logic if you modify the source code

---

[← Back to User Manual](USER-MANUAL.md)
