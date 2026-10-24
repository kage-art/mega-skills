---
name: android-master
description: >
  Master engineering and UI/UX skill for native Android development. Enforces modern Kotlin,
  Jetpack Compose, Material Design 3, Unidirectional Data Flow (UDF), ViewModel, StateFlow,
  Room database, edge-to-edge window insets, predictive back gestures, 48dp minimum touch targets,
  sp typography scaling, ANR prevention, and emulator/hardware verification via adb.
  Use whenever creating, reviewing, refactoring, or optimizing native Android applications.
---

# Android Master Engineering & Craft Skill

This skill guides the design, architecture, implementation, and verification of native Android applications. It enforces modern Android standards established by Google and eliminates all low-quality AI slop, obsolete patterns, and cross-platform antipatterns.

## 1. Core Architecture Principles (Unidirectional Data Flow)

- **Architecture Layering:** UI Layer (Compose screens, stateful composables, stateless previews) -> ViewModel / Presentation Layer (exposes `StateFlow<UiState>`) -> Domain Layer (UseCases) -> Data Layer (Repositories, Room DB, Retrofit / Ktor network).
- **Single Source of Truth:** UI state is held as an immutable data class (`sealed interface ScreenUiState`) and exposed via `StateFlow`. UI observes state using `collectAsStateWithLifecycle()` in Compose.
- **Events Up, State Down:** Composables accept state and lambda callbacks for user actions (`onItemClick: (String) -> Unit`); never pass `ViewModel` instances deep down into leaf composables.

```kotlin
// Example: Strict Immutable UI State
sealed interface ProductUiState {
    data object Loading : ProductUiState
    data class Success(val products: ImmutableList<ProductItem>) : ProductUiState
    data class Error(val message: String) : ProductUiState
}

@HiltViewModel
class ProductViewModel @Inject constructor(
    private val getProductsUseCase: GetProductsUseCase
) : ViewModel() {
    val uiState: StateFlow<ProductUiState> = getProductsUseCase()
        .map { ProductUiState.Success(it.toImmutableList()) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = ProductUiState.Loading
        )
}
```

## 2. Jetpack Compose Quality Floor

- **Recomposition Stability:** Mark external models with `@Immutable` or `@Stable`. Use `kotlinx.collections.immutable` (`ImmutableList`, `ImmutableSet`) instead of standard `List` to prevent unnecessary recompositions.
- **Remember Keys:** Always pass unique identity keys to `LazyColumn` / `LazyRow` items (`key = { item.id }`); never rely on list index.
- **Expensive Computations:** Wrap expensive calculations or sorting in `remember(key) { ... }` or `derivedStateOf { ... }`.
- **Modifier Discipline:** Every public composable must accept an optional `modifier: Modifier = Modifier` as its first optional parameter, and chain off it.

## 3. Material Design 3 (M3) Theming

- **Semantic Color Roles:** Use `MaterialTheme.colorScheme.primary`, `surface`, `surfaceVariant`, `onSurface`, `secondaryContainer`, `outline`. NEVER hardcode hex colors (`#FF123456`) in composables.
- **Dynamic Color (Material You):** Support dynamic theming on Android 12+ (`dynamicLightColorScheme(context)` / `dynamicDarkColorScheme(context)`) with a branded fallback scheme.
- **Typography Scale:** Strictly map text to `MaterialTheme.typography.displayLarge`, `headlineMedium`, `titleMedium`, `bodyLarge`, `labelSmall`. NEVER hand-pick arbitrary point sizes per screen.
- **Tonal Elevation:** Convey elevation through surface tonal color shifts and subtle shadows (`surfaceContainerLowest` through `surfaceContainerHighest`).

## 4. Mobile Anti-Slop Android Rules

1. **Edge-to-Edge & Window Insets:**
   - Call `enableEdgeToEdge()` in `MainActivity.onCreate()`.
   - Apply `Modifier.windowInsetsPadding(WindowInsets.safeDrawing)` or `WindowInsets.systemBars` so content is never obscured behind the status bar, camera cutout, or navigation bar.
   - For keyboard entry, handle `WindowInsets.ime` padding to guarantee the software keyboard does not cover input fields or action buttons.
2. **Touch Targets:**
   - Every interactive element (Button, Icon, Switch, Chip, ListItem) MUST have a minimum touch target size of **48×48 dp** with at least 8 dp spacing between targets.
3. **Typography Scaling:**
   - Always use `sp` units for font sizing so text scales gracefully with the user's system font size preference (up to 200%). Never use fixed `dp` or `px` for font sizing.
4. **System Back Gesture:**
   - Always honor the Android Predictive Back gesture. Use `BackHandler` in Compose only when intercepting unsaved state or bottom sheet dismissal. Never trap the user.
5. **No Fake Dialogs / No Generic Cards:**
   - Use standard Material BottomSheet (`ModalBottomSheet`) or Snackbars (`SnackbarHostState`) for non-blocking feedback. Dialogs are reserved solely for critical confirmations.

## 5. Performance & ANR Prevention

- **Thread Dispatchers:** NEVER perform disk I/O, database queries, image decoding, or network operations on `Dispatchers.Main`. All blocking operations must use `withContext(Dispatchers.IO)`.
- **StrictMode:** Enable `StrictMode.setThreadPolicy` and `StrictMode.setVmPolicy` in `Application.onCreate()` in debug builds to catch main thread disk/network leaks immediately.
- **Memory Management:** Clear references, cancel CoroutineJobs when ViewModels are cleared, avoid holding Activity context in Singletons.

## 6. Verification Protocol

- **Emulator / Device Capture:**
  - Build and install: `./gradlew installDebug`
  - Capture screenshot: `adb exec-out screencap -p > screenshot.png`
  - Test Dark Theme: `adb shell cmd uimode night yes`
  - Test Font Scaling (1.3x): `adb shell settings put system font_scale 1.3`
  - Reset Font Scaling: `adb shell settings put system font_scale 1.0`
