# Troubleshooting

Common questions and fixes for **8-Bit CPU Lab**.

---

## The page looks wrong or broken

### Fonts look plain or different

**Cause:** Google Fonts require internet on first load.

**Fix:** Connect to the internet and refresh. The simulator still works with system monospace fonts offline.

### ALU canvas is empty

**Cause:** Canvas may not have sized yet on slow loads.

**Fix:** Resize the browser window slightly or refresh the page. The animation loop redraws every frame.

### Layout is cramped on mobile

**Cause:** The UI is optimized for desktop (900px+).

**Fix:** Use a wider window or rotate a tablet to landscape. All features remain accessible via scrolling.

---

## Assembly program issues

### "No instructions to run"

**Cause:** The editor is empty or contains only comments/blank lines.

**Fix:** Add at least one instruction, e.g. `MOV A,1` and `HLT`.

### Program stops early with "step limit (200) reached"

**Cause:** Infinite loop without `HLT`, or loop runs more than 200 steps.

**Fix:**

- Add `HLT` where the program should end
- Check JMP targets — jumping to wrong line causes infinite loops
- Reduce loop iterations in test programs

### JMP / JZ does not work as expected

**Cause:** Jump targets are **line indices** (0-based), not RAM addresses.

Example — first line is index `0`:

```asm
MOV A,0    ; index 0
JMP 2      ; index 1 — jumps to index 2 (third line)
ADD A,B    ; index 2
```

**Fix:** Count lines starting from 0, ignoring comment-only lines (they are removed during parsing).

### JZ never jumps

**Cause:** Zero flag (Z) is not set before JZ.

**Fix:** Use `SUB A,B` or `ADD` that produces zero before `JZ`. Example:

```asm
MOV A,5
MOV B,5
SUB A,B    ; A=0, Z=1
JZ 4       ; jump to HLT
MOV A,99   ; skipped
HLT
```

### Unknown instruction in log

**Cause:** Typo or unsupported mnemonic.

**Fix:** Use only instructions from the [Instruction Reference](INSTRUCTION-REFERENCE.md). Check spelling (`MOV` not `MOVE`).

---

## Register & flag confusion

### ADD in assembly vs ADD button

Both perform `A = (A + B) mod 256`. Assembly **RUN** resets the CPU first; manual buttons do not (unless you press CLR ALL).

### Result register (ACC) does not edit

**By design:** ACC/R is output-only. Edit A or B, then run an operation.

### Carry flag wrong after SHL/SHR

**Fixed in v5.0:** C now correctly shows the bit shifted out. Update to the latest `8bit-cpu-lab.html` if you have an older copy.

### Signed vs unsigned mode

**Display only:** Toggling SIGNED/UNSIGNED changes decimal display, not the bits stored in registers.

---

## Memory & stack

### STORE / LOAD wrong value

**Cause:** Address is `n & 0x0F` — only 0–15 valid.

**Fix:** Use addresses 0–15. Click RAM cells to verify contents.

### POP says "Stack underflow"

**Cause:** POP when stack is empty.

**Fix:** Ensure PUSH runs before POP. Press CLR ALL to reset stack.

### RAM edits disappear after RUN

**Cause:** RUN calls `resetCPU()` which clears RAM.

**Fix:** This is intentional — each RUN starts fresh. Use STEP mode to preserve state between first load, or re-STORE after RUN.

---

## Running tests

### `npm test` fails

**Requirements:** Node.js 18+ installed.

```powershell
node --version
cd "d:\Computer architecture from scratch"
npm test
```

### Test fails after you edited the HTML

**Fix:** Compare your changes to the expected behavior in `tests/test-cpu.mjs`. Run individual logic checks manually in the browser.

---

## Browser-specific notes

| Browser | Notes |
|---------|-------|
| Chrome / Edge | Recommended — full canvas and animation support |
| Firefox | Fully supported |
| Safari | Supported; allow canvas if prompted |
| IE | **Not supported** |

### Opening via `file://`

Works in most cases. If scripts seem blocked, use `npm run serve` instead.

---

## Performance

### RUN animation is slow

**Fix:** Increase **Clock Speed** slider (1–10 Hz).

### Particles cause lag on old hardware

**Fix:** Particles are visual only. Reduce clock speed or avoid rapid button clicking. No setting disables particles, but lag is rare on modern machines.

---

## FAQ

**Q: Do I need to compile the project?**  
A: No. Open the HTML file directly. There is no build step.

**Q: Can I use this in a classroom offline?**  
A: Yes. Copy the whole folder to a USB drive. Fonts may fall back without internet.

**Q: Is this a real CPU?**  
A: It is a simplified educational model, not a specific commercial chip (8080, 6502, etc.). Instruction names are similar but the architecture is custom.

**Q: How many lines of assembly can I write?**  
A: Unlimited in the editor. RUN executes at most **200 instruction steps** per click.

**Q: Where is the source code?**  
A: All logic is inside `8bit-cpu-lab.html` in the `<script>` block at the bottom.

---

## Still stuck?

1. Press **CLR ALL** and try a minimal program (`MOV A,1` / `HLT`)
2. Open the browser developer console (F12) and check for JavaScript errors
3. Run `npm test` to verify CPU logic
4. Re-read [Getting Started](GETTING-STARTED.md) Level 3 walkthrough

---

[← Back to User Manual](USER-MANUAL.md)
