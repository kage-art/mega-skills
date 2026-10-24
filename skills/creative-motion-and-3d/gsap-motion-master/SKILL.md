---
name: gsap-motion-master
description: >
  Master skill for high-performance web animations using GreenSock Animation Platform (GSAP 3).
  Covers timelines, tweens, ScrollTrigger (pinning, scrub, snapping), gsap.matchMedia for responsive
  and accessible animations (prefers-reduced-motion), SVG morphing, and React/Vue/Vanilla lifecycle management.
  Use whenever creating smooth web animations, interactive landing pages, or complex motion graphics.
---

# GSAP Motion Master Skill

This skill provides expert implementation patterns for the GreenSock Animation Platform (GSAP), the industry standard for framework-agnostic 60fps web animation.

## 1. Core Syntax & Architecture

- **Timelines over loose tweens:** Always organize sequenced animations into `gsap.timeline()`. This allows global pause, reverse, scrubbing, and clean debugging.
- **Transform shortcuts:** Use GSAP's optimized shorthand properties (`x`, `y`, `scale`, `rotation`, `opacity`, `autoAlpha`) instead of animating raw CSS strings like `transform: "translate(10px)"` or `left/top` to guarantee GPU hardware acceleration.
- **autoAlpha:** Use `autoAlpha: 0` instead of `opacity: 0` to automatically set `visibility: hidden` and prevent click-blocking on invisible elements.

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Clean master timeline
const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

tl.from('.hero-badge', { y: 20, autoAlpha: 0 })
  .from('.hero-title', { y: 30, autoAlpha: 0 }, '-=0.5')
  .from('.hero-subtitle', { y: 20, autoAlpha: 0 }, '-=0.4')
  .from('.hero-cta', { scale: 0.95, autoAlpha: 0, stagger: 0.1 }, '-=0.3');
```

## 2. ScrollTrigger Patterns

### Pinning & Scrubbing
```javascript
gsap.to('.feature-card', {
  scrollTrigger: {
    trigger: '.features-container',
    start: 'top top',
    end: '+=2000',
    scrub: 1, // Smooth 1-second scrub catch-up
    pin: true,
    anticipatePin: 1
  },
  xPercent: -100 * (cards.length - 1),
  ease: 'none'
});
```

## 3. Responsive & Accessible Motion (`gsap.matchMedia`)

Never force heavy desktop animations onto mobile screens or users with vestibular motion sensitivities:

```javascript
const mm = gsap.matchMedia();

mm.add({
  isDesktop: "(min-width: 1024px)",
  isMobile: "(max-width: 1023px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (context) => {
  const { isDesktop, reduceMotion } = context.conditions;

  if (reduceMotion) {
    // Accessible, simple instant cut or gentle fade
    gsap.to('.hero-title', { autoAlpha: 1, duration: 0.2 });
    return;
  }

  if (isDesktop) {
    // Rich desktop 3D card tilt & parallax
    gsap.from('.hero-card', { y: 100, rotationX: 15, autoAlpha: 0, duration: 1.2 });
  } else {
    // Subtle mobile slide-up
    gsap.from('.hero-card', { y: 40, autoAlpha: 0, duration: 0.6 });
  }
});
```

## 4. Framework Lifecycle & Cleanup (React / Next.js)

Prevent memory leaks, duplicate triggers, and zombie tweens by scoping animations:

```jsx
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export function AnimatedSection() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.box', { y: 50, opacity: 0, stagger: 0.2 });
    }, containerRef); // Scope all selectors to container

    return () => ctx.revert(); // Complete cleanup on unmount
  }, []);

  return (
    <div ref={containerRef}>
      <div className="box">Item 1</div>
      <div className="box">Item 2</div>
    </div>
  );
}
```
