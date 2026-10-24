---
name: mega-master-skill
description: >
  The definitive, all-in-one Mega Master Skill for AI coding assistants.
  Eradicates all AI slop (generic purple gradients, floaty cards, fake TODOs, marketing clichés,
  keyboard-obscured inputs, tiny touch targets, and unhandled errors).
  Enforces native Android excellence (Kotlin, Jetpack Compose, M3, WindowInsets, Navigation 3, ANR prevention),
  native iOS excellence (Swift 6 Concurrency, SwiftUI, Apple HIG, SF Symbols, Liquid Glass, haptics),
  cross-platform mobile standards (React Native New Architecture, Reanimated 4, Flutter adaptive craft),
  senior engineering discipline (Test-Driven Development, systematic debugging, verification before completion),
  automated security (Strix OWASP Top 10 pentesting), and state-of-the-art web motion (GSAP, Lenis, Vanta 3D).
---

# ⚡ Mega Master Skill: Universal Engineering, Anti-Slop & Mobile Craft

You are operating under the **Mega Master Skill** protocol. This single unified directive governs every code generation, architectural decision, UI/UX design, and debugging workflow across Web, Android, iOS, and Backend environments.

---

## 1. The Anti-Slop Code & UI Directive

### Never Produce AI Slop
- **Zero Generic Aesthetics:** Reject repetitive purple-to-cyan gradients, floaty bubble cards with 28px+ border-radius, washed-out low-contrast grey text (`#9CA3AF`), and generic stock illustrations.
- **Zero Fake Implementations:** Never write `// TODO: Implement later`, mock functions returning static fake data in production code, or empty button click handlers `onClick={() => {}}`.
- **Zero AI Marketing Buzzwords:** Banish AI filler clichés ("Unlock the power of", "Seamlessly integrate", "Delve into", "A testament to"). Use direct, clear, human technical writing.
- **Intentional Design Systems:** Anchor every interface on curated typography, purposeful color tokens, strict 4px/8px spatial grids (`4, 8, 12, 16, 24, 32, 48, 64`), and WCAG AA/AAA contrast ratios.

---

## 2. Native Mobile App Mastery (Android & iOS)

### 🤖 Android Quality Standards (Kotlin / Jetpack Compose / M3)
- **Unidirectional Data Flow (UDF):** State down via immutable `StateFlow<ScreenUiState>`, events up via lambda callbacks. UI observes with `collectAsStateWithLifecycle()`.
- **Edge-to-Edge & Insets:** Always enable `enableEdgeToEdge()` in `MainActivity`. Apply `WindowInsets.safeDrawing` or `systemBars`. Always apply `WindowInsets.ime` padding to forms so virtual keyboards never cover text fields or submit buttons.
- **Touch Targets:** Minimum interactive touch target is **48×48 dp** with at least 8dp spacing between adjacent targets.
- **Typography Scaling:** Always use `sp` units for text to guarantee system accessibility font scaling (up to 200%) without clipping or truncation.
- **Predictive Back Navigation:** Respect Android's system Predictive Back gesture; never trap the user or hijack back navigation.
- **Main Thread Safety:** Never run database (Room) or network operations on `Dispatchers.Main`; use `withContext(Dispatchers.IO)`. Prevent ANRs.

### 🍎 iOS Quality Standards (Swift 6 / SwiftUI / Apple HIG)
- **Swift 6 & Concurrency:** Mark UI ViewModels with `@MainActor`. Use structured `async/await` and `@Observable` models. Ensure cross-domain types conform to `Sendable`.
- **Apple Human Interface Guidelines:** Use native materials (`.regularMaterial`, `.ultraThinMaterial`), SF Symbols 6, and native `NavigationStack` with interactive edge-swipe dismiss.
- **Safe Area & Dynamic Type:** Respect `safeAreaInsets`. Never place controls or text under the notch, Dynamic Island, or home indicator bar. All text must use semantic typography styles (`.headline`, `.body`, `.caption`) for Dynamic Type scaling.
- **Tactile Haptic Feedback:** Attach sensory haptics (`.sensoryFeedback(.impact(), trigger: ...)`) to primary confirmations and state changes.
- **Touch Targets:** Minimum interactive touch target size is **44×44 pt**.

### 📱 Cross-Platform Standards (React Native & Flutter)
- **React Native:** Use Software Mansion New Architecture, Reanimated 4, Gesture Handler, and safe area insets. Always wrap inputs in `KeyboardAvoidingView`.
- **Flutter:** Use `const` constructors everywhere, `RepaintBoundary` on animated subtrees, and adaptive widgets (`Switch.adaptive()`, `Slider.adaptive()`).

---

## 3. Senior Engineering & Verification Discipline

- **Test-Driven Development (TDD):** Write a failing test before writing production code. Confirm it fails with the expected assertion error, write the minimal code to pass, and refactor cleanly.
- **Systematic Debugging:** Never guess or shotgun-fix. Always form a testable hypothesis, reproduce the defect with a minimal test or reproduction script, identify root cause, and verify the fix.
- **Verification Before Completion:** Never claim a task or bug is complete without concrete proof (passing test suite, clean build, screenshots via `adb` or simulator or browser subagent).
- **Security Floor:** Enforce OWASP Top 10 mitigations: parameterized SQL queries, output encoding against XSS, strict CSRF/CORS policies, and secure permission handling.

---

## 4. Creative Motion & 3D Web Visuals

- **GSAP Timelines & ScrollTrigger:** Frame animations in `gsap.timeline()` with GPU-accelerated transforms (`x`, `y`, `scale`, `autoAlpha`). Always clean up with `ctx.revert()` on unmount and respect `prefers-reduced-motion`.
- **Lenis Smooth Scroll:** Synchronize momentum scroll with GSAP ticker; support accessibility overrides.
- **Vanta 3D WebGL:** Interactive Three.js backgrounds (Waves, Net, Halo, Dots) with strict context disposal on unmount to prevent GPU memory leaks.

---

## 5. Domain Routing & Deep-Dive Reference Index

When working on deep domain implementations, load the specialized reference files relative to this repository:

| Domain | Deep-Dive Reference | What it Covers |
|---|---|---|
| **Android Jetpack Compose** | [`skills/mobile-android/android-master/SKILL.md`](skills/mobile-android/android-master/SKILL.md) | UDF architecture, StateFlow, Room, Hilt, compose stability |
| **Android Insets & Back** | [`skills/mobile-android/android-edge-to-edge/SKILL.md`](skills/mobile-android/android-edge-to-edge/SKILL.md) | WindowInsetsCompat, IME insets, Predictive Back |
| **Android Performance** | [`skills/mobile-android/jetpack-compose-performance/SKILL.md`](skills/mobile-android/jetpack-compose-performance/SKILL.md) | ANR audit, recomposition tracking, StrictMode |
| **iOS Swift 6 & HIG** | [`skills/mobile-ios/ios-swiftui-master/SKILL.md`](skills/mobile-ios/ios-swiftui-master/SKILL.md) | SwiftUI `@Observable`, Swift 6 concurrency, Apple HIG |
| **Apple Design & 123 HIG Pages** | [`skills/mobile-ios/ios-apple-design-master/SKILL.md`](skills/mobile-ios/ios-apple-design-master/SKILL.md) | 123 pages of developer.apple.com guidelines, Liquid Glass |
| **Mobile Anti-Slop Directive** | [`skills/anti-slop/mobile-anti-slop/SKILL.md`](skills/anti-slop/mobile-anti-slop/SKILL.md) | The 8 cardinal sins of mobile UI & accessibility rules |
| **React Native (Reanimated)** | [`skills/mobile-cross-platform/react-native-best-practices/SKILL.md`](skills/mobile-cross-platform/react-native-best-practices/SKILL.md) | New Architecture, Reanimated 4, Gesture Handler |
| **Flutter 60/120fps** | [`skills/mobile-cross-platform/flutter-master-craft/SKILL.md`](skills/mobile-cross-platform/flutter-master-craft/SKILL.md) | Riverpod, RepaintBoundary, platform adaptive controls |
| **Hallmark 48 Visual Themes** | [`skills/anti-slop/hallmark-themes/SKILL.md`](skills/anti-slop/hallmark-themes/SKILL.md) | 48 curated themes refusing to look AI-generated |
| **Impeccable Design Floor** | [`skills/anti-slop/impeccable-craft/SKILL.md`](skills/anti-slop/impeccable-craft/SKILL.md) | 62 deterministic rules for spatial rhythm & typography |
| **TDD & Disciplined Coding** | [`skills/senior-engineering-and-tdd/superpowers-test-driven-development/SKILL.md`](skills/senior-engineering-and-tdd/superpowers-test-driven-development/SKILL.md) | Red-Green-Refactor, automated test suites |
| **Systematic Debugging** | [`skills/senior-engineering-and-tdd/superpowers-systematic-debugging/SKILL.md`](skills/senior-engineering-and-tdd/superpowers-systematic-debugging/SKILL.md) | Minimal reproduction scripts, root cause diagnosis |
| **Agentic Verification** | [`skills/senior-engineering-and-tdd/reticle-agentic-tdd/SKILL.md`](skills/senior-engineering-and-tdd/reticle-agentic-tdd/SKILL.md) | Replay user flows, verify login/logout, browser QA |
| **Security Pentesting** | [`skills/security-and-safety/strix-owasp-top-10-testing/SKILL.md`](skills/security-and-safety/strix-owasp-top-10-testing/SKILL.md) | OWASP Top 10 automated penetration testing |
| **Skill Malware Scanner** | [`skills/security-and-safety/skill-malware-scanner/SKILL.md`](skills/security-and-safety/skill-malware-scanner/SKILL.md) | Cyber antivirus: reverse shells, prompt injections & virus payloads |
| **Supply Chain Package Auditor** | [`skills/security-and-safety/supply-chain-security-scanner/SKILL.md`](skills/security-and-safety/supply-chain-security-scanner/SKILL.md) | Package & lockfile auditor: preinstall hooks, typosquatting & CVEs |
| **GSAP Motion Master** | [`skills/creative-motion-and-3d/gsap-motion-master/SKILL.md`](skills/creative-motion-and-3d/gsap-motion-master/SKILL.md) | GSAP 3 timelines, ScrollTrigger scrub & pin |
| **Lenis Smooth Scroll** | [`skills/creative-motion-and-3d/lenis-smooth-scroll/SKILL.md`](skills/creative-motion-and-3d/lenis-smooth-scroll/SKILL.md) | Momentum scrolling synchronized with RAF ticker |
| **Vanta 3D WebGL** | [`skills/creative-motion-and-3d/vanta-3d-backgrounds/SKILL.md`](skills/creative-motion-and-3d/vanta-3d-backgrounds/SKILL.md) | Three.js animated WebGL shaders with leak-free lifecycle |
