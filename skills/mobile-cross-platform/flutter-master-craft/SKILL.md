---
name: flutter-master-craft
description: >
  Master skill for building production-grade, 60/120fps cross-platform mobile apps using Flutter.
  Covers clean architecture, Riverpod / BLoC state management, platform-adaptive UI (Material 3 on Android,
  Cupertino on iOS), widget tree performance (RepaintBoundary, const constructors), deep linking,
  and integration with native device APIs.
---

# Flutter Master Craft Skill

This skill guides the creation of high-performance, beautiful cross-platform mobile applications in Flutter with authentic native fidelity on both Android and iOS.

## 1. Platform Adaptability (Cupertino & Material Dual Fidelity)

- Never force Android UI onto iOS users or vice versa.
- Use adaptive widgets (`Switch.adaptive`, `Slider.adaptive`, `CircularProgressIndicator.adaptive`).
- Match navigation idioms:
  - On iOS: Modal sheets present with interactive swipe-down, navigation uses CupertinoPageRoute with back-swipe.
  - On Android: Predictive back navigation, Material 3 bottom navigation bar, and standard Android page transitions.

## 2. Widget Tree Performance (Zero Dropped Frames)

1. **`const` Constructors Everywhere:** Prevent redundant widget rebuilds by adding `const` to all immutable widgets and constructors.
2. **`RepaintBoundary` for Heavy Subtrees:** Wrap frequently animating widgets or complex canvases in `RepaintBoundary` to isolate paint operations from the rest of the tree.
3. **Lazy Rendering:** Always use `ListView.builder` or `CustomScrollView` with `SliverList` for collections; never render large un-virtualized columns.
4. **Selector / Consumer Scoping:** Only rebuild the exact text label or icon that depends on a changing state slice, not the entire screen scaffold.

## 3. Architecture & State Management (Riverpod Pattern)

```dart
// Example: Notifier with AsyncValue
import 'package:flutter_riverpod/flutter_riverpod.dart';

final productsProvider = AsyncNotifierProvider<ProductsNotifier, List<Product>>(ProductsNotifier.new);

class ProductsNotifier extends AsyncNotifier<List<Product>> {
  @override
  Future<List<Product>> build() async {
    return ref.read(productRepositoryProvider).fetchProducts();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref.read(productRepositoryProvider).fetchProducts());
  }
}
```

## 4. Mobile Anti-Slop in Flutter

- **SafeArea:** Wrap scaffolds or body contents in `SafeArea` to avoid notch collisions.
- **Keyboard Overflow Prevention:** Always configure `resizeToAvoidBottomInset: true` on `Scaffold` and wrap scrollable inputs in `SingleChildScrollView`.
- **Haptics:** Invoke `HapticFeedback.lightImpact()` on tap confirmations and `HapticFeedback.selectionClick()` on picker scrolls.
- **Touch Targets:** Enforce `minimumSize: const Size(48, 48)` on all buttons and touch regions.
