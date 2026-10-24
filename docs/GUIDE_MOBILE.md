# 📱 MegaSkills Mobile Development Guide: Android & iOS

This guide provides end-to-end instructions and architecture patterns for building production-grade mobile applications on **Android** and **iOS** using the MegaSkills master repository.

---

## 📑 Table of Contents
1. [Android Development (Kotlin & Jetpack Compose)](#1-android-development-kotlin--jetpack-compose)
2. [iOS Development (Swift 6 & SwiftUI)](#2-ios-development-swift-6--swiftui)
3. [Cross-Platform Development (React Native & Flutter)](#3-cross-platform-development-react-native--flutter)
4. [Mobile Anti-Slop Enforcement](#4-mobile-anti-slop-enforcement)
5. [Automated Emulator & Device Verification](#5-automated-emulator--device-verification)

---

## 1. Android Development (Kotlin & Jetpack Compose)

MegaSkills enforces Google's official Android standards through `skills/mobile-android/android-master`.

### Architecture: Unidirectional Data Flow (UDF)
Every screen must adhere to strict separation of concerns:
```
Composables (UI) <--- StateFlow<ScreenUiState> --- ViewModel
                 --- (User Actions / Events) ---> 
```

### Production Compose Screen Pattern
```kotlin
package com.megaskills.ui.products

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.collections.immutable.ImmutableList

@Composable
fun ProductListScreen(
    viewModel: ProductViewModel,
    onProductClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        modifier = modifier.fillMaxSize(),
        contentWindowInsets = WindowInsets.safeDrawing, // Edge-to-edge support
        topBar = {
            TopAppBar(
                title = { Text("Catalog", style = MaterialTheme.typography.titleLarge) }
            )
        }
    ) { innerPadding ->
        when (val state = uiState) {
            is ProductUiState.Loading -> {
                Box(Modifier.fillMaxSize().padding(innerPadding)) {
                    CircularProgressIndicator()
                }
            }
            is ProductUiState.Success -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(innerPadding),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(state.products, key = { it.id }) { product ->
                        ProductCard(
                            product = product,
                            onClick = { onProductClick(product.id) }
                        )
                    }
                }
            }
            is ProductUiState.Error -> {
                ErrorView(
                    message = state.message,
                    onRetry = { viewModel.retry() },
                    modifier = Modifier.padding(innerPadding)
                )
            }
        }
    }
}
```

### Essential Android Rules
- **48dp Touch Targets:** Interactive surfaces (`IconButton`, `Button`, `ListItem`) must measure at least 48×48 dp.
- **sp Font Scaling:** Text sizes must use `sp` units so the system font-size multiplier (up to 200%) does not clip text.
- **Predictive Back Gesture:** Handle back events cleanly using `BackHandler` without intercepting or breaking system navigation.

---

## 2. iOS Development (Swift 6 & SwiftUI)

MegaSkills enforces Apple's Human Interface Guidelines (HIG) and Swift 6 concurrency safety through `skills/mobile-ios/ios-swiftui-master`.

### Swift 6 `@Observable` ViewModel Pattern
```swift
import SwiftUI
import Observation

@Observable
@MainActor
final class FeedViewModel {
    enum State: Sendable {
        case loading
        case success([FeedArticle])
        case error(String)
    }

    private(set) var state: State = .loading
    private let service: FeedServiceProtocol

    init(service: FeedServiceProtocol) {
        self.service = service
    }

    func loadArticles() async {
        state = .loading
        do {
            let data = try await service.fetchArticles()
            state = .success(data)
        } catch {
            state = .error(error.localizedDescription)
        }
    }
}
```

### Production SwiftUI View with Native HIG
```swift
import SwiftUI

struct FeedListView: View {
    @State private var viewModel: FeedViewModel

    init(service: FeedServiceProtocol) {
        _viewModel = State(initialValue: FeedViewModel(service: service))
    }

    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.state {
                case .loading:
                    ProgressView("Loading articles...")
                case .success(let articles):
                    List(articles) { article in
                        NavigationLink(destination: ArticleDetailView(article: article)) {
                            ArticleRow(article: article)
                        }
                        .listRowInsets(EdgeInsets(top: 12, leading: 16, bottom: 12, trailing: 16))
                    }
                    .listStyle(.insetGrouped)
                    .refreshable {
                        await viewModel.loadArticles()
                    }
                case .error(let message):
                    ContentUnavailableView {
                        Label("Unable to Load", systemImage: "wifi.slash")
                    } description: {
                        Text(message)
                    } actions: {
                        Button("Try Again") {
                            Task { await viewModel.loadArticles() }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            }
            .navigationTitle("Articles")
            .task {
                await viewModel.loadArticles()
            }
        }
    }
}
```

### Essential iOS Rules
- **44pt Hit Targets:** Minimum tappable bounds must be 44×44 pt.
- **Dynamic Type:** Use semantic `.font(.headline)`, `.body`, `.subheadline` to scale with system accessibility preferences.
- **Sensory Haptics:** Attach `.sensoryFeedback(.impact(weight: .medium), trigger: ...)` to confirmations and state changes.

---

## 3. Cross-Platform Development (React Native & Flutter)

### React Native Best Practices (Software Mansion Architecture)
- Use **React Native Reanimated 4** and **Gesture Handler** to run animations and gestures directly on the UI thread without crossing the bridge.
- Always use `KeyboardAvoidingView` or `react-native-keyboard-controller` to prevent software keyboards from obscuring inputs.
- Use `react-native-safe-area-context` for notch, dynamic island, and home indicator insets.

### Flutter Master Craft
- Use `const` constructors on every immutable widget to prevent redundant element rebuilds.
- Isolate frequently re-rendered subtrees inside `RepaintBoundary`.
- Use platform-adaptive widgets (`Switch.adaptive()`, `Slider.adaptive()`) so UI conforms naturally to the host OS.

---

## 4. Mobile Anti-Slop Enforcement

Before committing any mobile code, verify the **8 Mobile Anti-Slop Commandments**:
1. **No Obscured Inputs:** Virtual keyboard never covers active text field or submit buttons.
2. **No Miniscule Targets:** Every button has at least 48dp (Android) or 44pt (iOS) bounds.
3. **No Clipped Text:** Text scales up to 1.5x font size without clipping or overflowing containers.
4. **No Notch Overlaps:** Critical content respects safe area insets.
5. **No Trapped Back Buttons:** System Back (Android) and edge-swipe dismiss (iOS) function smoothly.
6. **No Infinite Spun Screens:** Every network request has a designated loading, empty, and retryable error state.
7. **No Desktop Hover Reliance:** All touch interactions are explicit and visible.
8. **No OS Impersonation:** Android apps look and feel native to Material Design; iOS apps look and feel native to Apple HIG.

---

## 5. Automated Emulator & Device Verification

MegaSkills provides terminal commands to verify mobile builds directly from your CLI or agent:

### Android Verification via `adb`
```bash
# Capture full screen from emulator
adb exec-out screencap -p > android_screen.png

# Test Night Mode (Dark Theme)
adb shell cmd uimode night yes
adb exec-out screencap -p > android_dark.png
adb shell cmd uimode night no

# Test 1.3x Accessibility Font Scale
adb shell settings put system font_scale 1.3
adb exec-out screencap -p > android_font_scaled.png
adb shell settings put system font_scale 1.0
```

### iOS Verification via `xcrun simctl`
```bash
# Capture screenshot from booted simulator
xcrun simctl io booted screenshot ios_screen.png

# Toggle Dark Mode
xcrun simctl ui booted appearance dark
xcrun simctl io booted screenshot ios_dark.png
xcrun simctl ui booted appearance light

# Test Extra-Large Dynamic Type
xcrun simctl ui booted content_size extra-extra-extra-large
xcrun simctl io booted screenshot ios_large_text.png
xcrun simctl ui booted content_size medium
```
