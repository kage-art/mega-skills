#!/usr/bin/env node

/**
 * generate-catalog.mjs
 * Indexes all standardized skills and original repos to generate searchable catalog files
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.resolve(REPO_ROOT, 'skills');
const CATALOG_DIR = path.resolve(REPO_ROOT, 'catalog');

console.log('[*] Generating MegaSkills Catalog...');

fs.mkdirSync(CATALOG_DIR, { recursive: true });

function parseSkillMd(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const nameMatch = content.match(/^name:\s*([^\r\n]+)/m);
    
    // Extract description (handling multi-line YAML block scalar >)
    let description = 'Master agent skill';
    const descBlockMatch = content.match(/^description:\s*>\s*\r?\n((?:[ \t]+[^\r\n]+\r?\n)+)/m);
    if (descBlockMatch) {
      description = descBlockMatch[1].replace(/^[ \t]+/gm, '').replace(/\r?\n/g, ' ').trim();
    } else {
      const descSimpleMatch = content.match(/^description:\s*["']?([^\r\n"'>]+)["']?/m);
      if (descSimpleMatch) {
        description = descSimpleMatch[1].trim();
      }
    }

    return {
      name: nameMatch ? nameMatch[1].trim() : path.basename(path.dirname(filePath)),
      description: description,
      file: filePath
    };
  } catch (err) {
    return null;
  }
}

// 1. Scan standardized skills/
const standardizedSkills = [];
if (fs.existsSync(SKILLS_DIR)) {
  const categories = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const cat of categories) {
    const catPath = path.join(SKILLS_DIR, cat.name);
    const skillDirs = fs.readdirSync(catPath, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const sd of skillDirs) {
      const skillFile = path.join(catPath, sd.name, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const meta = parseSkillMd(skillFile);
        if (meta) {
          standardizedSkills.push({
            id: sd.name,
            name: meta.name,
            category: cat.name,
            description: meta.description,
            relPath: path.relative(REPO_ROOT, skillFile).replace(/\\/g, '/'),
            platforms: cat.name.includes('mobile') || cat.name.includes('android') || cat.name.includes('ios') 
              ? ['Android', 'iOS', 'Mobile'] 
              : cat.name.includes('creative') 
              ? ['Web', 'WebGL', 'Frontend'] 
              : ['Universal', 'Cross-Platform']
          });
        }
      }
    }
  }
}

// Sort alphabetically by category and name
standardizedSkills.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

// 2. Write catalog/catalog.json
const catalogJsonPath = path.join(CATALOG_DIR, 'catalog.json');
fs.writeFileSync(catalogJsonPath, JSON.stringify({
  version: '1.0.0',
  totalCount: standardizedSkills.length,
  generatedAt: new Date().toISOString(),
  skills: standardizedSkills
}, null, 2), 'utf8');

console.log(`[+] Saved ${catalogJsonPath} (${standardizedSkills.length} skills)`);

// 3. Write catalog/catalog.md
let catalogMd = `# MegaSkills Master Catalog\n\n`;
catalogMd += `> Comprehensive index of **${standardizedSkills.length} standardized skills** included in the single-installation Mega Master repository.\n\n`;

// Group by category
const grouped = {};
for (const s of standardizedSkills) {
  grouped[s.category] = grouped[s.category] || [];
  grouped[s.category].push(s);
}

for (const [category, list] of Object.entries(grouped)) {
  const formattedCategory = category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  catalogMd += `## ${formattedCategory} (${list.length} Skills)\n\n`;
  catalogMd += `| Skill Name | Platforms | Description | Path |\n`;
  catalogMd += `|---|---|---|---|\n`;

  for (const s of list) {
    const platforms = s.platforms.join(', ');
    const shortDesc = s.description.length > 120 ? s.description.slice(0, 117) + '...' : s.description;
    catalogMd += `| **\`${s.name}\`** | \`${platforms}\` | ${shortDesc.replace(/\|/g, '\\|')} | [\`${s.id}\`](../${s.relPath}) |\n`;
  }
  catalogMd += `\n`;
}

const catalogMdPath = path.join(CATALOG_DIR, 'catalog.md');
fs.writeFileSync(catalogMdPath, catalogMd, 'utf8');
console.log(`[+] Saved ${catalogMdPath}`);

console.log('[OK] Catalog generation complete.');
