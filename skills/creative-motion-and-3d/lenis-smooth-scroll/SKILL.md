---
name: lenis-smooth-scroll
description: >
  Master skill for buttery smooth momentum scrolling using Lenis (Darkroom Engineering).
  Covers installation, initialization, GSAP ScrollTrigger synchronization, RAF loop integration,
  anchor link scrolling, accessibility checks (prefers-reduced-motion), and React/Next.js setup.
  Use whenever adding smooth scrolling to modern web applications and portfolio sites.
---

# Lenis Smooth Scrolling Master Skill

Lenis provides lightweight, robust smooth scrolling that feels natural and integrates seamlessly with GSAP ScrollTrigger and modern layout systems.

## 1. Quick Setup & Initialization

```javascript
import Lenis from 'lenis';
import 'lenis/dist/lenis.css'; // Essential base CSS

// Check accessibility preference first
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lenis = new Lenis({
  lerp: prefersReducedMotion ? 1 : 0.1, // Instant scroll if user prefers reduced motion
  duration: 1.2,
  smoothWheel: !prefersReducedMotion,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
});

// Animation loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

## 2. Synchronization with GSAP ScrollTrigger

When pairing Lenis with GSAP ScrollTrigger, synchronize the render ticks so scroll calculations match 1:1 without stutter:

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

// Update ScrollTrigger on every Lenis scroll event
lenis.on('scroll', ScrollTrigger.update);

// Direct GSAP's ticker to drive Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP lag smoothing to maintain fluid momentum
gsap.ticker.lagSmoothing(0);
```

## 3. Smooth Anchor Links

```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, {
        offset: -60, // Adjust for sticky navbar
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  });
});
```

## 4. Next.js / React Integration Component

```jsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```
