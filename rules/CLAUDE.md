# Universal Master AI Coding & Craft Directives

These directives govern all code generation, UI/UX design, and architectural decisions. They ensure all outputs are production-grade, zero-slop, and natively crafted for Web, Android, iOS, and Backend environments.

---

## 1. The Anti-Slop Code & UI Directive

### Never Produce AI Slop
- **No Generic AI Aesthetics:** Reject repetitive purple/cyan gradients, floaty bubble cards with excessive border-radius, washed-out grey body text, and generic stock illustrations.
- **No Fake or Placeholder Implementations:** Never leave `// TODO: Implement later`, mock functions that return fake data in production files, or dummy buttons with empty `onClick={() => {}}`.
- **No AI Filler Copy:** Banish AI marketing clichés ("Unlock the power of", "Seamlessly integrate", "Delve into", "A testament to"). Use authentic, direct, human copywriting.
- **Intentional Design Systems:** Anchor every frontend on curated typography (from Google Fonts or system fonts), purposeful color tokens, strict 4px/8px spatial grids, and high-contrast accessibility (WCAG AA/AAA).

---

## 2. Native Mobile Excellence (Android & iOS)

### Android Quality Standards (Kotlin / Jetpack Compose / M3)
- **Unidirectional Data Flow:** State down via immutable `StateFlow<ScreenUiState>`, events up via lambdas. UI observes with `collectAsStateWithLifecycle()`.
- **Edge-to-Edge & Insets:** Always enable `enableEdgeToEdge()` and apply `WindowInsets.safeDrawing` or `systemBars`. Handle `WindowInsets.ime` so the keyboard never obscures text inputs or action buttons.
- **Typography & Touch Targets:** Always use `sp` units for text to support accessibility scaling (up to 200%). All interactive touch targets must measure at least **48×48 dp** with 8dp spacing.
- **System Back Navigation:** Respect Android Predictive Back; never hijack or break the back gesture.
- **Thread Safety:** Never run database or network calls on `Dispatchers.Main`; use `withContext(Dispatchers.IO)`.

### iOS Quality Standards (Swift / SwiftUI / HIG)
- **Swift 6 & Concurrency:** Mark ViewModels with `@MainActor`. Use structured `async/await` and `@Observable` models. Ensure cross-domain types are `Sendable`.
- **Apple Human Interface Guidelines:** Use system materials (`.regularMaterial`), SF Symbols 6, and native `NavigationStack` with interactive edge-swipe dismiss.
- **Safe Area & Dynamic Type:** All views must use semantic typography (`.headline`, `.body`, `.caption`) and respect `safeAreaInsets`. Never place controls under the notch, dynamic island, or home indicator bar.
- **Haptic Feedback:** Attach sensory haptics (`.sensoryFeedback()`) to primary confirmations and selections.
- **Touch Targets:** Minimum interactive touch target size is **44×44 pt**.

### Cross-Platform Standards (React Native / Flutter)
- **React Native:** Use Software Mansion New Architecture, Reanimated 4, Gesture Handler, and safe area insets. Wrap forms in `KeyboardAvoidingView`.
- **Flutter:** Use `const` constructors, `RepaintBoundary` on animated subtrees, and adaptive controls (`Switch.adaptive`).

---

## 3. Senior Engineering & Verification Discipline

- **Test-Driven Development (TDD):** Write a failing test before writing production code. See it fail with the expected error, write the minimal code to pass, and refactor cleanly.
- **Systematic Debugging:** Never guess or shotgun-fix. Always form a testable hypothesis, reproduce the defect with a minimal test or script, verify the root cause, and verify the fix.
- **Verification Before Completion:** Never claim a task or bug is complete without concrete proof (test suite passing, build succeeded, screenshots captured via `adb` or simulator or browser subagent).
- **Security Floor:** Enforce OWASP Top 10 mitigations: parameterized queries (no SQL injection), output encoding (no XSS), strict CSRF/CORS policies, and secure permission handling.
