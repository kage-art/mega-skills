#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.resolve(REPO_ROOT, 'skills');
const RULES_DIR = path.resolve(REPO_ROOT, 'rules');

// Parse CLI flags
const args = process.argv.slice(2);
const flags = {
  profile: 'full', // 'full' | 'mobile' | 'anti-slop' | 'engineering' | 'creative'
  target: 'all',   // 'all' | 'antigravity' | 'claude' | 'cursor' | 'agents' | 'codex'
  dest: null,      // custom path
  link: false,     // symlink instead of copy
  master: false,   // install only the single master skill
  help: false,
  list: false,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help' || arg === '-h') flags.help = true;
  else if (arg === '--list' || arg === '-l') flags.list = true;
  else if (arg === '--master' || arg === '-m') { flags.master = true; flags.profile = 'master'; }
  else if (arg === '--link') flags.link = true;
  else if (arg === '--profile' && args[i + 1]) { flags.profile = args[++i].toLowerCase(); }
  else if (arg === '--target' && args[i + 1]) { flags.target = args[++i].toLowerCase(); }
  else if (arg === '--dest' && args[i + 1]) { flags.dest = path.resolve(args[++i]); }
}

const BANNER = `
========================================================================
   __  __ _____ ____    _       ____  _  _____ _     _     ____  
  |  \\/  | ____/ ___|  / \\     / ___|| |/ /_ _| |   | |   / ___| 
  | |\\/| |  _|| |  _  / _ \\    \\___ \\| ' / | || |   | |   \\___ \\ 
  | |  | | |__| |_| |/ ___ \\    ___) | . \\ | || |___| |___ ___) |
  |_|  |_|_____\\____/_/   \\_\\  |____/|_|\\_\\___|_____|_____|____/ 
                                                                  
      MEGA MASTER AGENT SKILLS FOR AI CODING ASSISTANTS
   Anti-Slop - Native Mobile (Android & iOS) - Senior Dev - Security
========================================================================
`;

console.log(BANNER);

if (flags.help) {
  console.log(`
Usage:
  node scripts/installer.mjs [options]
  npm run install:all
  npm run install:mobile
  npm run install:antislop

Options:
  --profile <name>   Skill profile to install:
                     - full        : All curated skills (default)
                     - mobile      : Android, iOS, React Native, Flutter & Mobile Anti-Slop
                     - anti-slop   : Pure anti-slop code, UI, copywriting & craft rules
                     - engineering : TDD, systematic debugging, code review & QA
                     - creative    : GSAP, Lenis, Vanta 3D, baseline UI & motion
  --target <tool>    Target assistant:
                     - all         : Auto-detect and install for all available assistants
                     - antigravity : Google Antigravity & Gemini CLI (~/.gemini/config/skills)
                     - claude      : Claude Code (~/.claude/skills)
                     - cursor      : Cursor IDE (.cursor/skills or ~/.cursor/skills)
                     - agents      : Open standard (.agents/skills)
                     - codex       : OpenAI Codex (~/.codex/skills)
  --dest <path>      Directly install into a custom folder or project root
  --link             Create symbolic links instead of copying files
  --list             List all available skills and exit
  --help, -h         Show this help screen
`);
  process.exit(0);
}

// Read all skills from the standardized `skills/` directory
function scanSkills(dir) {
  const result = [];
  if (!fs.existsSync(dir)) return result;

  const categories = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const cat of categories) {
    const catPath = path.join(dir, cat.name);
    const skillFolders = fs.readdirSync(catPath, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const sf of skillFolders) {
      const skillPath = path.join(catPath, sf.name);
      const skillFile = path.join(skillPath, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf8');
        const nameMatch = content.match(/^name:\s*([^\r\n]+)/m);
        const descMatch = content.match(/^description:\s*([^\r\n>]+)/m);
        result.push({
          category: cat.name,
          folder: sf.name,
          name: nameMatch ? nameMatch[1].trim() : sf.name,
          description: descMatch ? descMatch[1].trim() : 'Master agent skill',
          path: skillPath
        });
      }
    }
  }
  return result;
}

const allSkills = scanSkills(SKILLS_DIR);

if (flags.list) {
  console.log(`Discovered ${allSkills.length} standardized skills:\n`);
  const grouped = {};
  for (const s of allSkills) {
    grouped[s.category] = grouped[s.category] || [];
    grouped[s.category].push(s);
  }
  for (const [cat, list] of Object.entries(grouped)) {
    console.log(`[Category: ${cat}] (${list.length} skills)`);
    for (const item of list) {
      console.log(`  - ${item.name.padEnd(30)} : ${item.description.slice(0, 60)}...`);
    }
    console.log('');
  }
  process.exit(0);
}

// Filter skills by profile
function filterByProfile(skills, profile) {
  switch (profile) {
    case 'master': {
      const masterPath = path.join(REPO_ROOT, 'SKILL.md');
      return [{
        category: 'master',
        folder: 'mega-master-skill',
        name: 'mega-master-skill',
        description: 'The definitive all-in-one Mega Master Skill (Anti-Slop, Android, iOS, Senior Dev, Security, Motion)',
        path: path.join(SKILLS_DIR, 'mega-master-skill')
      }];
    }
    case 'mobile':
      return skills.filter(s =>
        s.category.includes('mobile') ||
        s.category.includes('android') ||
        s.category.includes('ios') ||
        s.folder.includes('mobile')
      );
    case 'anti-slop':
      return skills.filter(s =>
        s.category.includes('anti-slop') ||
        s.folder.includes('slop') ||
        s.folder.includes('impeccable') ||
        s.folder.includes('hallmark')
      );
    case 'engineering':
      return skills.filter(s =>
        s.category.includes('senior') ||
        s.category.includes('security') ||
        s.folder.includes('tdd') ||
        s.folder.includes('debug') ||
        s.folder.includes('review')
      );
    case 'creative':
      return skills.filter(s =>
        s.category.includes('creative') ||
        s.category.includes('motion') ||
        s.folder.includes('gsap') ||
        s.folder.includes('lenis') ||
        s.folder.includes('vanta')
      );
    case 'full':
    default:
      return skills;
  }
}

const selectedSkills = filterByProfile(allSkills, flags.profile);
console.log(`Selected Profile: [${flags.profile.toUpperCase()}] (${selectedSkills.length} skills to install)`);

// Determine target directories
const homeDir = os.homedir();
const targets = [];

if (flags.dest) {
  targets.push({ name: 'Custom Destination', path: flags.dest });
} else {
  if (flags.target === 'all' || flags.target === 'antigravity') {
    // Antigravity global customization root
    const agyConfig = path.join(homeDir, '.gemini', 'config', 'skills');
    targets.push({ name: 'Google Antigravity (~/.gemini/config/skills)', path: agyConfig });
  }
  if (flags.target === 'all' || flags.target === 'claude') {
    const claudeDir = path.join(homeDir, '.claude', 'skills');
    targets.push({ name: 'Claude Code (~/.claude/skills)', path: claudeDir });
  }
  if (flags.target === 'all' || flags.target === 'cursor') {
    const cursorDir = path.join(homeDir, '.cursor', 'skills');
    targets.push({ name: 'Cursor IDE (~/.cursor/skills)', path: cursorDir });
  }
  if (flags.target === 'all' || flags.target === 'agents') {
    const agentsDir = path.join(process.cwd(), '.agents', 'skills');
    targets.push({ name: 'Workspace .agents/skills (AAIF Standard)', path: agentsDir });
  }
  if (flags.target === 'all' || flags.target === 'codex') {
    const codexDir = path.join(homeDir, '.codex', 'skills');
    targets.push({ name: 'OpenAI Codex (~/.codex/skills)', path: codexDir });
  }
}

// Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('\nInstalling to targets:');
for (const target of targets) {
  console.log(`\n-> Installing to ${target.name}...`);
  fs.mkdirSync(target.path, { recursive: true });

  let installedCount = 0;
  for (const skill of selectedSkills) {
    const skillDest = path.join(target.path, skill.folder);
    try {
      if (flags.link) {
        if (fs.existsSync(skillDest)) fs.rmSync(skillDest, { recursive: true, force: true });
        fs.symlinkSync(skill.path, skillDest, 'junction');
      } else {
        copyDir(skill.path, skillDest);
      }
      installedCount++;
    } catch (err) {
      console.warn(`   [!] Could not install ${skill.folder}: ${err.message}`);
    }
  }
  console.log(`   [OK] Installed ${installedCount} skills into ${target.path}`);
}

// Install universal rules if target has workspace or root
console.log('\nDeploying Universal Anti-Slop & Mobile Quality Rules...');
const ruleFiles = [
  { src: 'GEMINI.md', dests: [path.join(homeDir, '.gemini', 'config', 'GEMINI.md')] },
  { src: 'CLAUDE.md', dests: [path.join(homeDir, '.claude', 'CLAUDE.md')] },
  { src: 'cursorrules', dests: [path.join(process.cwd(), '.cursorrules')] },
  { src: 'windsurfrules', dests: [path.join(process.cwd(), '.windsurfrules')] },
  { src: 'copilot-instructions.md', dests: [path.join(process.cwd(), '.github', 'copilot-instructions.md')] }
];

for (const r of ruleFiles) {
  const srcPath = path.join(RULES_DIR, r.src);
  if (fs.existsSync(srcPath)) {
    for (const d of r.dests) {
      try {
        fs.mkdirSync(path.dirname(d), { recursive: true });
        fs.copyFileSync(srcPath, d);
        console.log(`   [OK] Rule synced: ${d}`);
      } catch (err) {
        // Ignored if permissions prevent it
      }
    }
  }
}

console.log(`
========================================================================
[SUCCESS] Mega Master Skills installed successfully!
  Installed ${selectedSkills.length} skills across active AI environments.
  Your AI assistant is now equipped with:
    + Zero-Slop code & UI standards
    + Native Android & iOS development expertise (Compose, SwiftUI, HIG)
    + Disciplined TDD & systematic debugging workflows
    + Security & automated penetration auditing
    + State-of-the-art motion, GSAP, Lenis, and Vanta 3D graphics

To verify anytime:
  npm run verify
========================================================================
`);
