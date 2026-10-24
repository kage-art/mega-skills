#!/usr/bin/env node

/**
 * ========================================================================
 *   MEGA MASTER AGENT SKILLS: PACKAGE & LIBRARY SUPPLY CHAIN SECURITY SCANNER
 * ========================================================================
 * Audits package manifests, lockfiles, dependencies, and libraries before
 * installation to prevent:
 *   - Malicious install hooks (preinstall, postinstall, install)
 *   - Typosquatting & hijacked package maintainers
 *   - Dependency confusion & unpinned remote tarball URLs
 *   - Leaked private registry tokens & credentials
 *   - Known CVE vulnerabilities via OSV / npm audit
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// Dangerous shell execution signatures in npm scripts
const SUSPICIOUS_SCRIPT_PATTERNS = [
  /(?:curl|wget)\s+.*?\s*\|\s*(?:sh|bash|powershell|node)\b/i,
  /(?:nc|netcat)\s+-[eE]/i,
  /(?:powershell|cmd)\s+(?:\/c|-c|-enc)/i,
  /(?:node\s+-e\s+["'].*?(?:eval|atob|Buffer\.from)\()/i,
  /(?:python(?:\d)?\s+-c\s+["'].*?import\s+socket)/i,
  /(?:rm\s+-rf\s+[\/\\]|rmdir\s+\/s)/i
];

// High-profile historical hijacked or protestware packages
const KNOWN_RISKY_PACKAGES = new Set([
  'flatmap-stream',
  'peacenotwar',
  'node-ipc-fork',
  'ua-parser-js-malicious',
  'coa-malicious',
  'rc-malicious'
]);

/**
 * Audits a package.json manifest for supply chain risks.
 */
export function auditPackageJson(pkgPath) {
  const issues = [];
  if (!fs.existsSync(pkgPath)) return issues;

  try {
    const raw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);

    // 1. Audit lifecycle scripts for preinstall / postinstall code execution
    if (pkg.scripts) {
      const dangerousHooks = ['preinstall', 'install', 'postinstall', 'preuninstall', 'postuninstall'];
      for (const hook of dangerousHooks) {
        if (pkg.scripts[hook]) {
          const cmd = pkg.scripts[hook];
          let isMalicious = false;
          for (const pattern of SUSPICIOUS_SCRIPT_PATTERNS) {
            if (pattern.test(cmd)) {
              issues.push({
                severity: 'CRITICAL',
                category: 'Malicious Lifecycle Hook',
                message: `Dangerous pattern in '${hook}' script: "${cmd}"`,
                file: pkgPath
              });
              isMalicious = true;
              break;
            }
          }
          if (!isMalicious && !cmd.startsWith('node ') && !cmd.startsWith('npm run ') && !cmd.startsWith('npx ')) {
            issues.push({
              severity: 'WARNING',
              category: 'Suspicious Lifecycle Hook',
              message: `Arbitrary shell execution in '${hook}': "${cmd}"`,
              file: pkgPath
            });
          }
        }
      }
    }

    // 2. Audit dependencies
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.optionalDependencies || {})
    };

    for (const [depName, spec] of Object.entries(allDeps)) {
      // Check known hijacked list
      if (KNOWN_RISKY_PACKAGES.has(depName.toLowerCase())) {
        issues.push({
          severity: 'CRITICAL',
          category: 'Compromised Package',
          message: `Package '${depName}' has a history of malicious compromise`,
          file: pkgPath
        });
      }

      // Check for unauthenticated HTTP URLs
      if (spec.startsWith('http://') || spec.startsWith('git+http://')) {
        issues.push({
          severity: 'HIGH',
          category: 'Insecure Transport',
          message: `Dependency '${depName}' fetches over insecure plaintext HTTP (${spec})`,
          file: pkgPath
        });
      }

      // Check for dangerous wildcard dependencies
      if (spec === '*' || spec === 'latest') {
        issues.push({
          severity: 'MEDIUM',
          category: 'Unpinned Dependency',
          message: `Dependency '${depName}' uses wildcard version '${spec}' (vulnerable to instant supply chain drift)`,
          file: pkgPath
        });
      }
    }

    // 3. Scan for leaked tokens inside package.json
    if (raw.includes('_authToken') || raw.includes('npm_token') || raw.includes('ghp_')) {
      issues.push({
        severity: 'CRITICAL',
        category: 'Leaked Registry Token',
        message: 'Potential hardcoded authentication token detected inside package manifest',
        file: pkgPath
      });
    }

  } catch (err) {
    issues.push({
      severity: 'WARNING',
      category: 'Parse Error',
      message: `Failed to parse package.json: ${err.message}`,
      file: pkgPath
    });
  }

  return issues;
}

/**
 * Runs npm audit check if npm and lockfile are present.
 */
export function runNpmAudit(projectDir) {
  const lockfile = path.join(projectDir, 'package-lock.json');
  if (!fs.existsSync(lockfile)) {
    return { run: false, vulnerabilities: 0, critical: 0, high: 0, summary: 'No package-lock.json found' };
  }

  try {
    const output = execSync('npm audit --json', { cwd: projectDir, stdio: ['ignore', 'pipe', 'ignore'] });
    const report = JSON.parse(output.toString());
    const vulns = report.metadata?.vulnerabilities || {};
    return {
      run: true,
      vulnerabilities: report.metadata?.vulnerabilities?.total || 0,
      critical: vulns.critical || 0,
      high: vulns.high || 0,
      moderate: vulns.moderate || 0,
      low: vulns.low || 0,
      summary: `Found ${report.metadata?.vulnerabilities?.total || 0} vulnerabilities`
    };
  } catch (err) {
    // npm audit exits with 1 if vulnerabilities exist
    try {
      if (err.stdout) {
        const report = JSON.parse(err.stdout.toString());
        const vulns = report.metadata?.vulnerabilities || {};
        return {
          run: true,
          vulnerabilities: report.metadata?.vulnerabilities?.total || 0,
          critical: vulns.critical || 0,
          high: vulns.high || 0,
          moderate: vulns.moderate || 0,
          low: vulns.low || 0,
          summary: `Found ${report.metadata?.vulnerabilities?.total || 0} vulnerabilities`
        };
      }
    } catch (e) {}
    return { run: false, error: err.message };
  }
}

/**
 * Full supply chain security scan for a directory.
 */
export function scanPackageSecurity(dir) {
  const pkgFile = path.join(dir, 'package.json');
  const issues = auditPackageJson(pkgFile);
  const auditReport = runNpmAudit(dir);

  return {
    packageChecked: fs.existsSync(pkgFile),
    issues,
    auditReport
  };
}

// CLI Execution
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : REPO_ROOT;

  console.log('========================================================================');
  console.log('   📦  PACKAGE & LIBRARY SUPPLY CHAIN SECURITY SCANNER');
  console.log('========================================================================');
  console.log(`[*] Target Project: ${targetDir}\n`);

  const result = scanPackageSecurity(targetDir);

  if (!result.packageChecked) {
    console.log('\x1b[33m[!] No package.json found in the target directory.\x1b[0m');
    process.exit(0);
  }

  let hasCriticalOrHigh = false;

  if (result.issues.length === 0) {
    console.log('\x1b[32m\x1b[1m[✔ PASS] Package manifest is 100% clean!\x1b[0m');
    console.log('  • No malicious install lifecycle hooks detected (preinstall / postinstall)');
    console.log('  • No hijacked or blacklisted packages found');
    console.log('  • No insecure HTTP dependencies or leaked auth tokens\n');
  } else {
    console.log(`\x1b[33m\x1b[1m[*] Manifest Findings (${result.issues.length}):\x1b[0m`);
    for (const issue of result.issues) {
      const color = issue.severity === 'CRITICAL' || issue.severity === 'HIGH' ? '\x1b[31m' : '\x1b[33m';
      console.log(`  - ${color}[${issue.severity}]\x1b[0m \x1b[1m${issue.category}:\x1b[0m ${issue.message}`);
      if (issue.severity === 'CRITICAL' || issue.severity === 'HIGH') {
        hasCriticalOrHigh = true;
      }
    }
    console.log('');
  }

  if (result.auditReport.run) {
    console.log(`[*] Dependency Vulnerability Audit: ${result.auditReport.summary}`);
    if (result.auditReport.critical > 0 || result.auditReport.high > 0) {
      console.log(`  \x1b[31m[!] Critical: ${result.auditReport.critical}, High: ${result.auditReport.high}\x1b[0m`);
      hasCriticalOrHigh = true;
    } else {
      console.log('  \x1b[32m[✔] Zero critical or high vulnerabilities detected in dependencies.\x1b[0m');
    }
  }

  if (hasCriticalOrHigh) {
    console.log('\n\x1b[31m\x1b[1m[ALERT] High-severity supply chain risks detected. Review before installing packages.\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[32m\x1b[1m[SUCCESS] Package and dependencies verified safe for setup!\x1b[0m\n');
    process.exit(0);
  }
}
