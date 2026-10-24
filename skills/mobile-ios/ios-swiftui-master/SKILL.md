---
name: ios-swiftui-master
description: >
  Master engineering and UI/UX skill for native iOS and iPadOS development. Enforces modern Swift 6,
  SwiftUI, Apple Human Interface Guidelines (HIG), Swift Concurrency (@MainActor, async/await, Actors, Sendable),
  Clean Architecture, Liquid Glass & system vibrancy, Safe Area insets, Dynamic Type scaling,
  haptic feedback (UIImpactFeedbackGenerator), and simulator verification via xcrun simctl.
  Use whenever creating, auditing, or optimizing native iOS applications in Swift and SwiftUI.
---

# iOS & SwiftUI Master Engineering & HIG Craft Skill

This skill enforces high-discipline Apple design standards, modern Swift 6 architecture, and native iOS conventions. It ensures apps feel unmistakably native to iOS and eliminates sloppy web-like or Android-like ports.

## 1. Modern Swift 6 & Concurrency Standards

- **Complete Data Race Safety:** Strict Swift 6 mode compliance. Mark UI-bound ViewModels and state containers with `@MainActor`.
- **Structured Concurrency:** Use `async/await` and `TaskGroup` instead of Grand Central Dispatch (`DispatchQueue.main.async`). Always handle cancellation cooperatively (`Task.isCancelled`).
- **Sendable Types:** Ensure all models passed across concurrency domains conform to `Sendable`. Immutable `struct` is the default.

```swift
// Example: Swift 6 @Observable ViewModel
import SwiftUI
import Observation

@Observable
@MainActor
final class FeedViewModel {
    enum State: Sendable {
        case loading
        case success([FeedItem])
        case error(String)
    }

    private(set) var state: State = .loading
    private let repository: FeedRepositoryProtocol

    init(repository: FeedRepositoryProtocol) {
        self.repository = repository
    }

    func loadFeed() async {
        state = .loading
        do {
            let items = try await repository.fetchFeed()
            state = .success(items)
        } catch {
            state = .error(error.localizedDescription)
        }
    }
}
```

## 2. Apple Human Interface Guidelines (HIG) Compliance

- **Safe Area Insets:** Respect `safeAreaInsets`. Never place interactive controls or critical text under the Dynamic Island, notch, or home indicator. Only extend full-bleed background colors and images via `.ignoresSafeArea()`.
- **Dynamic Type:** All text views must use semantic typography styles (`.font(.largeTitle)`, `.title`, `.headline`, `.body`, `.caption`). Never hardcode fixed point sizes (e.g., `.font(.system(size: 16))`) without `@ScaledMetric` scaling.
- **SF Symbols 6:** Use system SF Symbols for icons (`Image(systemName: "tray.full")`) with appropriate rendering modes (`.symbolRenderingMode(.hierarchical)`) and variable color states.
- **Vibrancy & Materials:** Use standard Apple materials for sheets, sidebars, and navigation bars (`.background(.regularMaterial)`, `.ultraThinMaterial`).
- **Interactive Navigation & Gestures:** Always support standard edge-swipe-to-dismiss (`interactivePopGestureRecognizer`). Never hijack or disable system navigation gestures without explicit user consent.

## 3. Sensory Feedback & Haptics

Every primary touch action must deliver physical, tactile confirmation:
```swift
// Sensory feedback modifier (iOS 17+)
Button(action: { performAction() }) {
    Label("Confirm", systemImage: "checkmark.circle.fill")
}
.sensoryFeedback(.success, trigger: isCompleted)
.sensoryFeedback(.impact(weight: .medium, intensity: 0.8), trigger: tapCount)
```

## 4. Mobile Anti-Slop iOS Rules

1. **Touch Target Size:**
   - Minimum interactive target size is **44×44 pt** with adequate padding between items (`.contentShape(Rectangle())` to expand hit tests).
2. **Tab Bar & Navigation:**
   - Use `TabView` for primary destinations (3–5 tabs) on iPhone. Tab bars must remain fixed at the bottom.
   - Use standard `NavigationStack` with large titles collapsing into inline navigation headers on scroll.
3. **No Web-Port Slop:**
   - No custom hamburger menus on iPhone screens (use a Tab Bar or navigation toolbar menu).
   - No flat grey Android-like divider lines everywhere; use native List grouping (`.listStyle(.insetGrouped)`).
   - No custom drawn alert dialogs; use `.alert()` or `.confirmationDialog()`.
4. **Dark Mode & Contrast:**
   - Test both `.light` and `.dark` color schemes. Use semantic colors (`Color(.systemBackground)`, `Color(.secondarySystemBackground)`, `Color(.label)`, `Color(.secondaryLabel)`).

## 5. Verification via Simulator

- **Build and Run:**
  - Build for simulator: `xcodebuild -scheme AppName -destination 'platform=iOS Simulator,name=iPhone 16 Pro' build`
- **Simulator Automation:**
  - Capture screenshot: `xcrun simctl io booted screenshot screenshot.png`
  - Toggle Dark Mode: `xcrun simctl ui booted appearance dark`
  - Adjust Dynamic Type: `xcrun simctl ui booted content_size extra-extra-extra-large`
