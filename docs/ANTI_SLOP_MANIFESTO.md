# 🛡️ The Anti-Slop Manifesto

## What is AI Slop?

**AI Slop** is the digital byproduct of thoughtless generation: code that compiles but is unmaintainable; interfaces that render but fail real users; copy that fills space but conveys zero genuine meaning.

MegaSkills exists to eradicate AI slop at the root.

---

## 1. Code Slop

### The Symptoms
- **Fake Implementations:** Functions with `// TODO: implement later` or placeholder return statements (`return true;`).
- **Hallucinated Dependencies:** Importing non-existent packages or methods from deprecated library versions.
- **Shotgun Debugging:** Wrapping failing code in generic `try-catch` blocks that swallow exceptions silently without diagnosing the root cause.
- **Copy-Paste Duplication:** Creating 5 identical helper functions instead of extracting a clean, tested abstraction.

### The MegaSkills Rule
1. **Never write incomplete code:** If a feature cannot be completed, refuse the shortcut or build the minimal working vertical slice.
2. **Never guess API signatures:** Verify signatures against installed packages or official SDK documentation.
3. **Reproduce before fixing:** Always write a failing test reproducing the defect before touching production code.
4. **Clean up before committing:** Remove all debugging console logs, unused imports, and temporary comments.

---

## 2. UI & Design Slop

### The Symptoms
- **The AI Purple Gradient:** The infamous purple-to-cyan diagonal gradient plastered onto every navbar, button, and hero background.
- **Floaty Bubble Cards:** Border-radius of 28px+ on nested cards, creating an ungrounded, bubbly appearance with huge drop shadows.
- **Low-Contrast Blindness:** Using `#9CA3AF` (light grey) text on white backgrounds, failing WCAG AA contrast standards.
- **Ad-Hoc Sizing:** Mixing `13px`, `17px`, `22px` font sizes with `11px`, `19px` paddings with no baseline grid or rhythm.

### The MegaSkills Rule
1. **Intentional Theming:** Choose from vetted, authentic design systems (like Hallmark's 48 curated themes: Newsprint, Solstice, Terminal, Riso, Werkstatt, Ultraviolet) or define a clear design token set.
2. **Strict Spatial Rhythm:** All margins, paddings, and gaps must follow a 4px/8px grid system (`4, 8, 12, 16, 24, 32, 48, 64`).
3. **Contrast Verification:** All body copy must achieve at least 4.5:1 contrast against its background; interactive elements must achieve at least 3:1.
4. **Purposeful Motion:** Animations must be fast, crisp, and purposeful (150ms–350ms with `cubic-bezier(0.16, 1, 0.3, 1)` easing). Always support `prefers-reduced-motion`.

---

## 3. Copywriting Slop

### The Banned Vocabulary
AI models default to hyperbolic, generic sales jargon:
- ❌ *"Unlock the full potential of..."*
- ❌ *"Seamlessly integrate and elevate..."*
- ❌ *"A testament to modern engineering..."*
- ❌ *"In today's fast-paced digital world..."*
- ❌ *"Delve into our groundbreaking solutions..."*

### The MegaSkills Rule
Write like an engineer communicating with another engineer:
- ✅ *"Sync user records across Postgres and Redis in under 5ms."*
- ✅ *"Inspect database queries and catch slow joins before deployment."*
- ✅ *"Filter logs by status code, IP address, or timestamp."*

---

## 4. Mobile Slop

### The Symptoms
- Text inputs covered by virtual keyboards when typing.
- Text strings truncated with `...` when a user enables larger system accessibility fonts.
- Minuscule 20px buttons that cannot be reliably tapped with a thumb.
- Android screens displaying iOS-style rounded switches and navigation chevron buttons.

### The MegaSkills Rule
- **48dp (Android) / 44pt (iOS) touch minimums.**
- **Automatic keyboard padding.**
- **Strict `sp` and Dynamic Type font scaling.**
- **Predictive back and edge-swipe gesture support.**

---

## 5. Verification: The Non-Negotiable Contract

An AI agent has not completed its task when it finishes typing; it has completed its task when **empirical verification succeeds**:
1. Unit and integration tests pass cleanly.
2. Build commands complete with zero compiler warnings or lint errors.
3. Screenshots or visual DOM verification confirms the layout renders correctly in both Light and Dark modes.
