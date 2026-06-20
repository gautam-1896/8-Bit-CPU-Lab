<div align="center">
  <h1>💻 8-Bit CPU Lab</h1>
  <p><strong>An advanced, interactive, browser-based simulator for exploring computer architecture from scratch.</strong></p>

  ![Version](https://img.shields.io/badge/version-5.0-green)
  ![License](https://img.shields.io/badge/license-MIT-blue)
  ![Tests](https://img.shields.io/badge/tests-13%20passing-brightgreen)
  
  <br />
  <img src="output%20image/image.png" alt="8-Bit CPU Lab Interface" width="900"/>
  <br />


  <p><em>Experience the Fetch-Decode-Execute cycle in real-time, right in your browser
     (recommendation used in 60% to 80% zoom).</em></p>
</div>

---

## 🌟 What Is This Project?

**8-Bit CPU Lab** is an interactive educational sandbox tailored for students, hobbyists, and professionals seeking to understand the core mechanics of a CPU. Without the need for a backend or installation, you can dive straight into the bits and bytes of computer architecture.

**Key capabilities include:**
- Manipulate individual bits in registers **A** and **B**.
- Execute arithmetic and logic operations directly on the **ALU**.
- Visualize the **Fetch → Decode → Execute** cycle through live animations.
- Write, step through, and execute **Assembly** code.
- Monitor **RAM**, the **Stack**, **Program Counter (PC)**, and **CPU Flags**.

---

## 🚀 Quick Start

### Option 1: Direct Run (Simplest)
1. Open `8bit-cpu-lab.html` in any modern browser (Chrome, Firefox, Edge, Safari).
2. Click **EXAMPLE** in the Assembly Simulator panel to load a demo program.
3. Press **RUN** to watch registers, flags, and the execution log update.

### Option 2: Local Web Server (Development)
```powershell
# Navigate to the project directory
cd "d:\Computer architecture from scratch"

# Run automated CPU logic tests
npm test

# Start server at http://localhost:8080
npm run serve
```
*Open `http://localhost:8080/8bit-cpu-lab.html` in your browser.*

> 💡 **PRO TIP: Best Viewing Experience**
> For the optimal layout and visual fidelity, we highly recommend setting your browser zoom level to **60% - 80%**. This ensures all panels and UI elements fit perfectly on your screen without overlap!

---

## ⚙️ Core Features & Capabilities

| Module | Features |
|:---|:---|
| **Registers** | Edit A, B, and Result (ACC) via bit clicks or BIN/DEC/HEX/OCT inputs. |
| **Status Flags** | Real-time tracking of Z (Zero), C (Carry), S (Sign), V (Overflow), P (Parity), and A (Aux Carry). |
| **ALU Operations**| Support for ADD, SUB, AND, OR, XOR, NOT, SHL, SHR, ROL, ROR, SWAP, and CLR. |
| **Memory** | 16 bytes of interactive RAM (addresses 0x00–0x0F) with click-to-edit cells. |
| **Stack** | PUSH A / POP A with visual stack push/pop display. |
| **Assembly IDE** | Integrated editor to Write programs, RUN, STEP, or load built-in examples. |
| **Visualizations**| Animated ALU diamond, dynamic data flow paths, particle effects, and FDE cycle highlights. |

---

## 📁 Project Structure

```text
Computer architecture from scratch/
├── 8bit-cpu-lab.html      # Main application (HTML + CSS + JS)
├── package.json           # npm scripts for testing & serving
├── output image/          # Application screenshots
├── tests/
│   └── test-cpu.mjs       # Automated unit tests for CPU logic
└── docs/
    └── user-manual/       # Comprehensive user guide
        ├── USER-MANUAL.md
        ├── GETTING-STARTED.md
        ├── INSTRUCTION-REFERENCE.md
        └── TROUBLESHOOTING.md
```

---

## 🎯 Primary Use Cases

- 🎓 **Classroom Demonstrations:** Visually explain how addition affects carry and overflow flags.
- 🧠 **Self-Study:** Practice binary/hexadecimal conversions by directly interacting with registers.
- 📝 **Homework Labs:** Write assembly snippets utilizing `JMP`, `JZ`, `STORE`, and `LOAD`.
- 💻 **Interview Preparation:** Quickly refresh 8-bit ALU operations, bitwise logic, and flag behavior.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---:|:---|
| `A` | ADD A + B |
| `S` | SUB A − B |
| `N` | NOT A |
| `X` | XOR A ^ B |
| `←` | Shift Left (SHL) |
| `→` | Shift Right (SHR) |
| `R` | Rotate Left (ROL) |
| `Ctrl + Enter` | Run assembly program |

*(Shortcuts are disabled while typing in input fields or the assembly editor to prevent accidental executions.)*

---

## 🧪 Testing

The project comes with automated tests to validate CPU arithmetic, flags, assembly parsing, jumps, stack operations, and memory handling.

```powershell
npm test
```
**Expected output:**
```text
Results: 13 passed, 0 failed
```

---

## 📚 Documentation

For step-by-step instructions, opcode syntax, and troubleshooting, refer to our **[User Manual](docs/user-manual/USER-MANUAL.md)**:

- 🟢 [Getting Started](docs/user-manual/GETTING-STARTED.md) — First session walkthrough
- 📖 [Instruction Reference](docs/user-manual/INSTRUCTION-REFERENCE.md) — Detailed explanation of every opcode
- 🛠️ [Troubleshooting](docs/user-manual/TROUBLESHOOTING.md) — Common issues and resolutions

---

## 📜 License

This project is licensed under the **MIT License** — completely free to use for educational, personal, and teaching purposes.

---

<div align="center">
  <i>Built to make computer architecture accessible, interactive, and visually stunning.</i>
</div>
