#!/usr/bin/env node

/**
 * verify-skills.mjs
 * Validates formatting, YAML frontmatter, and security standards across all skills
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.resolve(REPO_ROOT, 'skills');

console.log('[*] Running MegaSkills Safety & Format Verification...');

let totalChecked = 0;
let errors = 0;
let warnings = 0;

function checkSkillDir(skillPath) {
  const skillFile = path.join(skillPath, 'SKILL.md');
  totalChecked++;

  if (!fs.existsSync(skillFile)) {
    console.error(`[FAIL] Missing SKILL.md in: ${path.relative(REPO_ROOT, skillPath)}`);
    errors++;
    return;
  }

  const content = fs.readFileSync(skillFile, 'utf8');

  // Check YAML frontmatter
  if (!content.startsWith('---')) {
    console.warn(`[WARN] Missing leading YAML delimiter (---) in: ${path.relative(REPO_ROOT, skillFile)}`);
    warnings++;
  }

  const nameMatch = content.match(/^name:\s*([^\r\n]+)/m);
  if (!nameMatch) {
    console.error(`[FAIL] Missing 'name' field in: ${path.relative(REPO_ROOT, skillFile)}`);
    errors++;
  }

  const descMatch = content.match(/^description:\s*([^\r\n]+)/m);
  if (!descMatch) {
    console.warn(`[WARN] Missing 'description' field in: ${path.relative(REPO_ROOT, skillFile)}`);
    warnings++;
  }

  // Security checks (SkillSpector rule set)
  const suspiciousPatterns = [
    { pattern: /curl\s+-[sS]*\s*http[^\s]+\s*\|\s*(sh|bash)/i, name: 'Remote piping to shell' },
    { pattern: /rm\s+-rf\s+\/($|\s)/i, name: 'Root filesystem deletion' },
    { pattern: /powershell[^\n]*iex[^\n]*downloadstring/i, name: 'PowerShell IEX download cradle' },
    { pattern: /eval\s*\(\s*atob\s*\(/i, name: 'Base64 obfuscated eval' }
  ];

  for (const { pattern, name } of suspiciousPatterns) {
    if (pattern.test(content)) {
      console.error(`[SECURITY ALERT] Suspicious pattern detected (${name}) in: ${path.relative(REPO_ROOT, skillFile)}`);
      errors++;
    }
  }
}

if (fs.existsSync(SKILLS_DIR)) {
  const cats = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const cat of cats) {
    const catPath = path.join(SKILLS_DIR, cat.name);
    const skills = fs.readdirSync(catPath, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const s of skills) {
      checkSkillDir(path.join(catPath, s.name));
    }
  }
}

console.log('\n========================================================================');
console.log(`Verification Summary:`);
console.log(`  Total Skills Checked : ${totalChecked}`);
console.log(`  Errors Found         : ${errors}`);
console.log(`  Warnings Found       : ${warnings}`);
console.log('========================================================================');

if (errors > 0) {
  console.error('[FAILED] Some skills failed verification. Review errors above.');
  process.exit(1);
} else {
  console.log('[SUCCESS] All skills passed safety and format verification!');
  process.exit(0);
}
