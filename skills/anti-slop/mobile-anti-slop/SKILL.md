---
name: mobile-anti-slop
description: >
  Universal Mobile Anti-Slop Directive for Android, iOS, React Native, and Flutter.
  Eradicates all sloppy mobile UI/UX and architectural flaws: keyboard obscuring text fields,
  clipped text under accessibility font scaling, tiny touch targets under 48dp/44pt,
  status bar and home indicator overlapping, missing offline/empty states, trapped back navigation,
  and clumsy web-first patterns forced onto mobile touchscreens.
---

# Universal Mobile Anti-Slop Directive

This skill establishes the non-negotiable quality floor for mobile applications across native Android (Kotlin/Compose), native iOS (Swift/SwiftUI), React Native, and Flutter.

## The 8 Cardinal Sins of Mobile AI Slop

### 1. The Obscured Keyboard Trap
- **The Slop:** An AI generates a login or form screen. When the user taps a text input, the virtual keyboard pops up and covers the submit button or input field completely.
- **The Fix:**
  - Android: Apply `Modifier.imePadding()` or `WindowInsets.ime` to scroll containers.
  - iOS: Embed forms in a `ScrollView` or `Form` with automatic keyboard avoidance; attach primary buttons to `.toolbar { ToolbarItemGroup(placement: .keyboard) { ... } }`.
  - React Native: Always wrap forms in `KeyboardAvoidingView` or `react-native-keyboard-controller`.
  - Flutter: Use `Scaffold.resizeToAvoidBottomInset = true` with a `SingleChildScrollView`.

### 2. The Minuscule Touch Target
- **The Slop:** 16px text links or 20px icon buttons placed right next to each other, causing user rage taps.
- **The Fix:**
  - Strict minimum interactive touch target is **48×48 dp** on Android and **44×44 pt** on iOS.
  - Spacing between adjacent touch targets must be at least 8dp/8pt.

### 3. Notch & Home Indicator Blindness
- **The Slop:** Content extends to the top of the screen and gets cut in half by the camera notch, pill, or Dynamic Island, or bottom buttons collide with the iOS home swipe bar.
- **The Fix:**
  - Only full-bleed decorative background images and container colors may ignore safe areas.
  - All interactive controls, text, icons, and buttons must respect system window insets / safe area padding.

### 4. Broken Accessibility Text Scaling
- **The Slop:** Hardcoded fixed font sizes and heights (e.g. `height: 40px`, `fontSize: 14px`). When users turn on 1.3x or 1.5x system text size, the text gets chopped off or overflows cards.
- **The Fix:**
  - Use scalable units: `sp` on Android, semantic Dynamic Type on iOS.
  - Containers must never have fixed vertical heights when containing dynamic text; use `minHeight` or let containers wrap content naturally.

### 5. Trapped Back Navigation & Hijacked Gestures
- **The Slop:** Custom top-left back buttons that don't hook into the system back navigation, breaking Android's Predictive Back gesture and iOS's interactive edge-swipe dismiss.
- **The Fix:**
  - On Android: Integrate with `OnBackPressedDispatcher` or Compose `BackHandler`.
  - On iOS: Keep standard `NavigationStack` or `UINavigationController` so edge swipe works natively.

### 6. The "Infinite Void" (Missing Loading, Empty & Error States)
- **The Slop:** Screen is completely blank while fetching data, or stays blank forever if a network error occurs.
- **The Fix:**
  - Every screen must explicitly define a finite state machine:
    1. **Loading State:** Shimmer skeleton or subtle progress indicator.
    2. **Empty State:** Clear illustration/icon, explanatory message, and an actionable CTA (e.g., "Add your first item").
    3. **Error State:** Human-readable explanation and an immediate "Retry" button.
    4. **Success State:** Populated content with pull-to-refresh.

### 7. Desktop Hover Assumptions on Mobile
- **The Slop:** Tooltips, action buttons, or critical information hidden behind hover states that can never be reached on a touchscreen.
- **The Fix:**
  - Touchscreens have no hover. All critical actions must be visible or accessible through direct tap, long-press, or context menus.

### 8. Cross-Platform Impersonation Slop
- **The Slop:** An Android app showing iOS Cupertino switches and bottom chevrons, or an iOS app showing Android navigation drawers and rectangular ripple blocks.
- **The Fix:**
  - When building cross-platform (React Native / Flutter), either adopt a unified, modern, customized brand design system, or adaptively render native components per platform.

## Pre-Release Verification Checklist

Before considering any mobile feature complete, verify:
- [ ] Screen rendered in Dark Mode with verified contrast.
- [ ] Screen tested with 1.3x font scale to ensure no clipped text.
- [ ] Keyboard opened; all inputs and action buttons remain visible and scrollable.
- [ ] System Back / edge-swipe dismiss tested and working.
- [ ] No touch target smaller than 48dp / 44pt.
- [ ] Network disconnected; error and retry state displays cleanly.
