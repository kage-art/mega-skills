---
name: vanta-3d-backgrounds
description: >
  Master skill for embedding animated 3D WebGL background effects using Vanta.js (Three.js and p5.js).
  Covers high-performance configuration of WAVES, NET, HALO, DOTS, FOG, CLOUDS, BIRDS, and RIPPLE.
  Includes GPU memory leak prevention, destroy lifecycle cleanup, mobile responsiveness, and dark mode theming.
  Use whenever creating visually stunning 3D interactive hero sections and animated landing pages.
---

# Vanta 3D Backgrounds Master Skill

Vanta.js provides animated 3D WebGL backgrounds that turn ordinary hero sections into state-of-the-art interactive visual experiences.

## 1. Quick Setup & Three.js Dependency

```html
<!-- Load Three.js followed by the desired Vanta effect -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"></script>

<div id="vanta-hero" style="width: 100%; height: 100vh;">
  <div class="hero-content">Your Wow-Factor Content</div>
</div>

<script>
  const effect = VANTA.WAVES({
    el: "#vanta-hero",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x0f172a, // Deep slate dark mode
    shininess: 35.00,
    waveHeight: 18.00,
    waveSpeed: 0.75,
    zoom: 0.85
  });
</script>
```

## 2. Top Curated Effect Configurations

### Futuristic Mesh (`VANTA.NET`)
```javascript
VANTA.NET({
  el: "#net-bg",
  color: 0x6366f1,          // Indigo accent
  backgroundColor: 0x090d16,// Midnight background
  points: 12.00,
  maxDistance: 22.00,
  spacing: 16.00,
  showDots: true
});
```

### Cosmic Glow (`VANTA.HALO`)
```javascript
VANTA.HALO({
  el: "#halo-bg",
  baseColor: 0x4f46e5,
  backgroundColor: 0x030712,
  amplitudeFactor: 1.5,
  size: 1.2
});
```

### Minimal Clean Mesh (`VANTA.DOTS`)
```javascript
VANTA.DOTS({
  el: "#dots-bg",
  color: 0x38bdf8,
  color2: 0x818cf8,
  backgroundColor: 0x0b0f19,
  size: 3.00,
  spacing: 35.00
});
```

## 3. Strict React / Next.js Lifecycle Management (No Memory Leaks)

WebGL contexts will crash browser tabs if not disposed when navigating away:

```jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

export function VantaHero() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          color: 0x0f172a,
          waveSpeed: 0.8
        })
      );
    }

    return () => {
      // Critical: dispose WebGL context on unmount
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="relative w-full min-h-screen flex items-center justify-center">
      <div className="z-10 text-white">Headline Here</div>
    </div>
  );
}
```
