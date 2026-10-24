#!/usr/bin/env node

/**
 * build-skills.mjs
 * Consolidates and structures all top-tier skills into the standardized `skills/` directory
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.resolve(REPO_ROOT, 'skills');
const UPSTREAM_DIR = path.resolve(REPO_ROOT, 'upstream');

console.log('[*] Building standardized skills directory in:', SKILLS_DIR);

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '.git' && entry.name !== 'node_modules') {
        copyDirRecursive(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

// 1. Anti-Slop Category
const antiSlopSrc = path.join(UPSTREAM_DIR, 'anti-slop', 'skills');
if (fs.existsSync(antiSlopSrc)) {
  const dirs = ['antislop-code', 'antislop-ui', 'antislop-copywriting', 'antislop-layoutmobile', 'antislop-human'];
  for (const d of dirs) {
    const src = path.join(antiSlopSrc, d);
    const dest = path.join(SKILLS_DIR, 'anti-slop', d);
    copyDirRecursive(src, dest);
    console.log(`[+] Cloned skill: anti-slop/${d}`);
  }
}

// Impeccable craft
const impeccableSrc = path.join(UPSTREAM_DIR, 'impeccable', 'skill');
if (fs.existsSync(impeccableSrc)) {
  const dest = path.join(SKILLS_DIR, 'anti-slop', 'impeccable-craft');
  copyDirRecursive(impeccableSrc, dest);
  // Ensure SKILL.md exists
  const skillSrc = path.join(dest, 'SKILL.src.md');
  const skillFinal = path.join(dest, 'SKILL.md');
  if (!fs.existsSync(skillFinal) && fs.existsSync(skillSrc)) {
    fs.copyFileSync(skillSrc, skillFinal);
  }
  console.log('[+] Cloned skill: anti-slop/impeccable-craft');
}

// Hallmark themes
const hallmarkSrc = path.join(UPSTREAM_DIR, 'hallmark', 'skills', 'hallmark');
if (fs.existsSync(hallmarkSrc)) {
  const dest = path.join(SKILLS_DIR, 'anti-slop', 'hallmark-themes');
  copyDirRecursive(hallmarkSrc, dest);
  console.log('[+] Cloned skill: anti-slop/hallmark-themes');
}

// UI-skills: baseline-ui, fixing-accessibility, fixing-motion-performance
const uiSkillsSrc = path.join(UPSTREAM_DIR, 'ui-skills', 'skills');
if (fs.existsSync(uiSkillsSrc)) {
  const items = ['baseline-ui', 'fixing-accessibility', 'fixing-motion-performance', 'improve-ui'];
  for (const it of items) {
    const src = path.join(uiSkillsSrc, it);
    const dest = path.join(SKILLS_DIR, 'anti-slop', it);
    copyDirRecursive(src, dest);
    console.log(`[+] Cloned skill: anti-slop/${it}`);
  }
}

// 2. Mobile Android Category
const androidSrc = path.join(UPSTREAM_DIR, 'android-skills');
const androidMappings = [
  { src: 'jetpack-compose/jetpack-compose-performance', dest: 'jetpack-compose-performance' },
  { src: 'system/edge-to-edge', dest: 'android-edge-to-edge' },
  { src: 'navigation/navigation-3', dest: 'android-navigation-3' },
  { src: 'performance/anr-audit-and-fix', dest: 'android-anr-audit' },
  { src: 'security/android-permissions-security', dest: 'android-permissions-security' },
  { src: 'camera/camerax', dest: 'android-camerax' },
  { src: 'litert/litert-lm', dest: 'android-device-ai' },
  { src: 'jetpack-compose/adaptive', dest: 'android-adaptive-layouts' },
];

for (const m of androidMappings) {
  const src = path.join(androidSrc, m.src);
  const dest = path.join(SKILLS_DIR, 'mobile-android', m.dest);
  if (copyDirRecursive(src, dest)) {
    console.log(`[+] Cloned skill: mobile-android/${m.dest}`);
  }
}

// 3. Mobile iOS Category
const appleSrc = path.join(UPSTREAM_DIR, 'apple-design-skill');
if (fs.existsSync(appleSrc)) {
  const dest = path.join(SKILLS_DIR, 'mobile-ios', 'ios-apple-design-master');
  copyDirRecursive(appleSrc, dest);
  console.log('[+] Cloned skill: mobile-ios/ios-apple-design-master');
}

// 4. Mobile Cross-Platform Category (React Native & Flutter)
const rnSrc = path.join(UPSTREAM_DIR, 'software-mansion-skills', 'skills');
if (fs.existsSync(rnSrc)) {
  const rnMappings = [
    { src: 'react-native-best-practices', dest: 'react-native-best-practices' },
    { src: 'animations', dest: 'react-native-reanimated' },
    { src: 'gestures', dest: 'react-native-gestures' },
    { src: 'pulsar-haptics', dest: 'react-native-pulsar-haptics' },
  ];
  for (const m of rnMappings) {
    const src = path.join(rnSrc, m.src);
    const dest = path.join(SKILLS_DIR, 'mobile-cross-platform', m.dest);
    if (copyDirRecursive(src, dest)) {
      console.log(`[+] Cloned skill: mobile-cross-platform/${m.dest}`);
    }
  }
}

// 5. Senior Engineering & TDD Category
const spSrc = path.join(UPSTREAM_DIR, 'superpowers', 'skills');
if (fs.existsSync(spSrc)) {
  const spList = [
    'test-driven-development',
    'systematic-debugging',
    'verification-before-completion',
    'writing-plans',
    'executing-plans'
  ];
  for (const s of spList) {
    const src = path.join(spSrc, s);
    const dest = path.join(SKILLS_DIR, 'senior-engineering-and-tdd', `superpowers-${s}`);
    if (copyDirRecursive(src, dest)) {
      console.log(`[+] Cloned skill: senior-engineering-and-tdd/superpowers-${s}`);
    }
  }
}

// Ponytail
const ponytailSrc = path.join(UPSTREAM_DIR, 'ponytail', 'skills');
if (fs.existsSync(ponytailSrc)) {
  const pList = ['ponytail-review', 'ponytail-audit', 'ponytail-debt', 'ponytail-gain'];
  for (const p of pList) {
    const src = path.join(ponytailSrc, p);
    const dest = path.join(SKILLS_DIR, 'senior-engineering-and-tdd', p);
    if (copyDirRecursive(src, dest)) {
      console.log(`[+] Cloned skill: senior-engineering-and-tdd/${p}`);
    }
  }
}

// Reticle
const reticleSrc = path.join(UPSTREAM_DIR, 'reticle', 'skills');
if (fs.existsSync(reticleSrc)) {
  const rList = ['agentic-tdd', 'audit-my-app', 'replay-user-flows', 'verify-ui-change', 'verify-login-logout'];
  for (const r of rList) {
    const src = path.join(reticleSrc, r);
    const dest = path.join(SKILLS_DIR, 'senior-engineering-and-tdd', `reticle-${r}`);
    if (copyDirRecursive(src, dest)) {
      console.log(`[+] Cloned skill: senior-engineering-and-tdd/reticle-${r}`);
    }
  }
}

// 6. Security Category
const strixSrc = path.join(UPSTREAM_DIR, 'strix', 'skills');
if (fs.existsSync(strixSrc)) {
  const sList = ['penetration-testing-with-strix', 'owasp-top-10-testing', 'find-security-vulnerabilities-in-code'];
  for (const s of sList) {
    const src = path.join(strixSrc, s);
    const dest = path.join(SKILLS_DIR, 'security-and-safety', `strix-${s}`);
    if (copyDirRecursive(src, dest)) {
      console.log(`[+] Cloned skill: security-and-safety/strix-${s}`);
    }
  }
}

// SkillSpector
const spectSrc = path.join(UPSTREAM_DIR, 'SkillSpector', 'skills', 'skill-inspector');
if (fs.existsSync(spectSrc)) {
  const dest = path.join(SKILLS_DIR, 'security-and-safety', 'skillspector-safety-scanner');
  if (copyDirRecursive(spectSrc, dest)) {
    console.log('[+] Cloned skill: security-and-safety/skillspector-safety-scanner');
  }
}

// 7. Anthropic Official Skills
const anthSrc = path.join(UPSTREAM_DIR, 'anthropics-skills', 'skills');
if (fs.existsSync(anthSrc)) {
  const aList = ['mcp-builder', 'skill-creator', 'web-artifacts-builder', 'webapp-testing', 'canvas-design'];
  for (const a of aList) {
    const src = path.join(anthSrc, a);
    const dest = path.join(SKILLS_DIR, 'workflow-and-ecosystem', a);
    if (copyDirRecursive(src, dest)) {
      console.log(`[+] Cloned skill: workflow-and-ecosystem/${a}`);
    }
  }
}

console.log('\n[OK] Standardized skill assets copied successfully.');
